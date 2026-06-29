"""Agent Loop 主循环 —— 感知→思考→行动→观察→落盘。

run_agent_loop：调用 DeepSeek 跑最多 5 轮工具调用循环，产出建议或 HOLD；
无 API key / LLM 失败 / yfinance 失败时降级到 mock_judge（EMA 交叉 + RSI + ADX 规则）。
"""
from __future__ import annotations

import json
import re

from .llm import (TOOL_SCHEMAS, build_system_prompt, build_user_message,
                  call_llm, has_api_key)
from .suggest import build_suggestion
from .tracker import calc_win_rate, get_current_suggestion, get_recent_suggestions

MAX_ITERATIONS = 5


def _clean_text(s: str | None) -> str:
    """剥离 LLM 输出里的 Markdown 强调/标题符号，前端按纯文本展示。"""
    if not s:
        return s or ""
    s = s.replace("**", "").replace("*", "").replace("`", "")
    s = re.sub(r"^\s{0,3}#{1,6}\s+", "", s, flags=re.MULTILINE)
    return s


def execute_tool(name: str, args: dict, context: dict) -> str:
    """执行 LLM 调用的工具，返回观察字符串。"""
    ind = context["indicators"]
    if name == "get_indicator":
        key = args.get("indicator")
        val = ind.get(key)
        if val is None:
            return f"指标 {key} 不存在，可选：{', '.join(list(ind.keys()))}"
        return f"{key} = {val}"
    if name == "get_recent_suggestions":
        limit = int(args.get("limit", 5) or 5)
        recent = context.get("recent_suggestions", [])[:limit]
        if not recent:
            return "暂无历史建议"
        return "\n".join(
            f"- {s['direction']} {s['horizon']} conf{s['confidence']} → {s['status']}"
            f"（{s.get('resolvedAt','open')}）"
            for s in recent
        )
    if name == "submit_suggestion":
        return "submit"
    return f"未知工具 {name}"


def _assistant_msg_with_tool(thought: str, tool_call) -> dict:
    return {
        "role": "assistant",
        "content": thought or "",
        "tool_calls": [{
            "id": tool_call.id,
            "type": "function",
            "function": {"name": tool_call.function.name,
                         "arguments": tool_call.function.arguments},
        }],
    }


def run_agent_loop(snapshot: dict, history: list[dict],
                    api_key: str | None = None, llm_caller=None) -> dict:
    """跑一轮 Agent Loop。返回 {mode, iterations, trace, suggestion, error}。"""
    recent = get_recent_suggestions(history, 10)
    current = get_current_suggestion(history)
    win_rate = calc_win_rate(history)
    context = {
        "indicators": snapshot["indicators"],
        "recent_suggestions": recent,
        "history": history,
        "snapshot": snapshot,
    }

    if not api_key and not has_api_key():
        return mock_judge(snapshot, history)

    messages = [
        {"role": "system", "content": build_system_prompt(snapshot["ticker"])},
        {"role": "user", "content": build_user_message(snapshot, win_rate, recent, current)},
    ]
    trace: list[dict] = []
    caller = llm_caller or call_llm

    for i in range(MAX_ITERATIONS):
        try:
            resp = caller(messages, TOOL_SCHEMAS, api_key)
        except Exception as e:
            return mock_judge(snapshot, history, error=f"LLM 调用失败: {e}")

        msg = resp.choices[0].message
        thought = _clean_text((msg.content or "").strip())
        tool_calls = msg.tool_calls or []

        if not tool_calls:
            action = "HOLD（观望）"
            obs = "Agent 未提交建议，选择观望"
            trace.append({"thought": thought, "action": action, "observation": obs})
            return {"mode": "live", "iterations": i + 1, "trace": trace,
                    "suggestion": None, "error": None}

        tc = tool_calls[0]
        name = tc.function.name
        try:
            args = json.loads(tc.function.arguments or "{}")
        except json.JSONDecodeError:
            args = {}

        if name == "submit_suggestion":
            direction = args.get("direction", "flat")
            horizon = args.get("horizon", "swing")
            confidence = int(args.get("confidence", 50) or 50)
            reasoning = _clean_text(args.get("reasoning", ""))
            sug = build_suggestion(snapshot, direction, horizon, confidence, reasoning, thought)
            action = f"submit_suggestion({direction}, {horizon}, conf={confidence})"
            obs = f"建议已提交：{direction} {horizon} 信心度 {confidence}"
            trace.append({"thought": thought, "action": action, "observation": obs})
            return {"mode": "live", "iterations": i + 1, "trace": trace,
                    "suggestion": sug, "error": None}

        result = execute_tool(name, args, context)
        action = f"{name}({args})"
        trace.append({"thought": thought, "action": action, "observation": result})
        messages.append(_assistant_msg_with_tool(thought, tc))
        messages.append({"role": "tool", "tool_call_id": tc.id, "content": result})

    return {"mode": "live", "iterations": MAX_ITERATIONS, "trace": trace,
            "suggestion": None, "error": "超过最大迭代仍未决策"}


def mock_judge(snapshot: dict, history: list[dict], error: str | None = None) -> dict:
    """规则降级：EMA 交叉 + ADX 趋势强度 + RSI 区间 → 方向/信心度/周期。"""
    ind = snapshot["indicators"]
    ema_cross = ind.get("emaCross", "death")
    rsi = float(ind.get("rsi", 50) or 50)
    adx = float(ind.get("adx", 0) or 0)

    if ema_cross == "golden" and adx >= 20 and 40 <= rsi <= 75:
        direction = "long"
        confidence = min(70, 50 + int((adx - 20) / 2))
        reasoning = f"规则降级：EMA20 上穿 EMA60，ADX={adx:.0f} 趋势成立，RSI={rsi:.0f} 未超买，看多"
    elif ema_cross == "death" and adx >= 20 and 25 <= rsi <= 60:
        direction = "short"
        confidence = min(70, 50 + int((adx - 20) / 2))
        reasoning = f"规则降级：EMA20 下穿 EMA60，ADX={adx:.0f} 趋势成立，RSI={rsi:.0f} 未超卖，看空"
    else:
        direction = "flat"
        confidence = 40
        reasoning = f"规则降级：趋势不明确（EMA{ema_cross}，ADX={adx:.0f}，RSI={rsi:.0f}），观望"

    horizon = "trend" if adx >= 25 else "swing"
    thought = reasoning

    if direction == "flat":
        return {
            "mode": "mock", "iterations": 1,
            "trace": [{"thought": thought, "action": "HOLD（规则降级）",
                       "observation": "未提交建议，观望"}],
            "suggestion": None, "error": error,
        }

    sug = build_suggestion(snapshot, direction, horizon, confidence, reasoning, thought)
    action = f"submit_suggestion({direction}, {horizon}, conf={confidence}) [mock]"
    return {
        "mode": "mock", "iterations": 1,
        "trace": [{"thought": thought, "action": action,
                   "observation": "规则降级建议已提交"}],
        "suggestion": sug, "error": error,
    }
