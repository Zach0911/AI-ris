"""DeepSeek LLM 封装 —— Agent 的「思考」。

OpenAI 兼容 SDK：base_url=https://api.deepseek.com，模型 deepseek-chat，temp 0.3。
system prompt 强制 Thought/Action/Observation 三段式，并通过 tool calling 结构化输出。
"""
from __future__ import annotations

import os

try:
    from openai import OpenAI
except Exception:  # openai 未装时仍可降级
    OpenAI = None

BASE_URL = "https://api.deepseek.com"
MODEL = "deepseek-chat"
TEMP = 0.3
MAX_TOKENS = 800

TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "get_indicator",
            "description": "取当前最新一个指标的数值，可多次调用查看不同指标。",
            "parameters": {
                "type": "object",
                "properties": {
                    "indicator": {
                        "type": "string",
                        "enum": ["price", "ema20", "ema60", "ema20Pct", "ema60Pct",
                                 "emaCross", "rsi", "atr", "atrPct", "adx", "plusDi",
                                 "minusDi", "macd", "macdHist", "volumeRatio"],
                    }
                },
                "required": ["indicator"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "get_recent_suggestions",
            "description": "复盘最近若干条已结算建议及其结局，用于校准自己后续判断。",
            "parameters": {
                "type": "object",
                "properties": {"limit": {"type": "integer", "minimum": 1, "maximum": 20}},
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "submit_suggestion",
            "description": (
                "提交本轮交易建议。止损=ATR×2、止盈=ATR×3、仓位按 2% 风险反推，"
                "均由系统自动算，你只给方向/信心度/周期/理由。"
                "若判断不清晰，可不调用此工具，直接输出 HOLD。"
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "direction": {"type": "string", "enum": ["long", "short", "flat"]},
                    "confidence": {"type": "integer", "minimum": 0, "maximum": 100,
                                   "description": "对本次方向的信心度 0-100"},
                    "horizon": {"type": "string", "enum": ["swing", "trend"]},
                    "reasoning": {"type": "string", "description": "一句话理由"},
                },
                "required": ["direction", "confidence", "horizon", "reasoning"],
            },
        },
    },
]


def has_api_key() -> bool:
    return bool(os.getenv("DEEPSEEK_API_KEY"))


def build_system_prompt(ticker: str) -> str:
    return f"""你是「AI 趋势研判 Agent」，一个为 {ticker}（纳斯达克 100 ETF）做趋势跟踪的交易决策 Agent。

你的工作方式（每轮一次 Agent Loop）：
1. 感知：用户消息已给你当前指标快照、历史胜率、最近已结算建议。
2. 思考：用「Thought: ...」开头，简述你对当前趋势/结构的判断与依据。
3. 行动：调用工具或给出结论。
   - 想看某指标细节 → 调 get_indicator。
   - 想复盘自己最近表现 → 调 get_recent_suggestions。
   - 形成明确建议 → 调 submit_suggestion（方向/信心度/周期/理由）。
   - 判断不清晰、信号矛盾 → 不调工具，直接输出 HOLD 并说明原因。
4. 观察：工具返回后纳入下一轮思考。

决策原则：
- 趋势跟踪：EMA20 与 EMA60 的关系、ADX 是否 >20（有无趋势）、RSI 是否在 40-70（顺势且不追极端）、MACD 柱方向。
- 信心度校准：参考你的历史胜率，胜率低时降低信心度，没把握就 flat/HOLD，不要为了出建议而出建议。
- 同时只允许一条 open 建议：若已有 open 建议在跟踪，本轮优先复盘而非重复下单（但仍可 submit 一条新方向以覆盖判断，系统会处理）。
- horizon：ADX>=25 且 EMA60 同向 → trend；否则 swing。

每次回复务必以「Thought:」开头，然后调用工具或输出 HOLD。"""


def _fmt_win_rate(wr: dict) -> str:
    if not wr or wr.get("winRate") is None:
        return "样本不足（<5 条已结算），暂无可靠胜率"
    return (f"已结算 {wr['decided']} 条，胜率 {wr['winRate']}%"
            f"（win {wr['wins']}/loss {wr['losses']}/expired {wr['expired']}），"
            f"近 {wr['recent10']['count']} 条胜率 {wr['recent10']['winRate']}%")


def build_user_message(snapshot: dict, win_rate: dict, recent: list[dict],
                        current: dict | None) -> str:
    ind = snapshot["indicators"]
    lines = [
        f"标的：{snapshot['ticker']}  最新收盘日：{snapshot['asOfDate']}  收盘价：{ind['price']}",
        "当前指标快照：",
        f"- EMA20={ind['ema20']:.2f}  EMA60={ind['ema60']:.2f}  交叉={ind['emaCross']}",
        f"- 价格相对 EMA20 {ind['ema20Pct']:+.2f}%  相对 EMA60 {ind['ema60Pct']:+.2f}%",
        f"- RSI(14)={ind['rsi']:.1f}  ADX(14)={ind['adx']:.1f}  +DI={ind['plusDi']:.1f}  -DI={ind['minusDi']:.1f}",
        f"- ATR(14)={ind['atr']:.2f}（占价 {ind['atrPct']:.2f}%）  MACD柱={ind['macdHist']:.3f}  量比={ind['volumeRatio']:.2f}",
        f"历史胜率：{_fmt_win_rate(win_rate)}",
    ]
    if current:
        lines.append(
            f"当前 open 建议：{current['direction']} {current['horizon']}，"
            f"entry={current['entry']} stop={current['stop']} target={current['target']}，"
            f"已持有 {current.get('daysOpen',0)}/{current['maxDays']} 天"
        )
    else:
        lines.append("当前无 open 建议。")
    if recent:
        sample = [f"{s['direction']} {s['horizon']} conf{s['confidence']}→{s['status']}" for s in recent[:5]]
        lines.append("最近已结算建议：" + " | ".join(sample))
    else:
        lines.append("暂无历史建议，这是首次运行。")
    lines.append("请给出本轮判断与建议（Thought 开头，然后调用工具或 HOLD）。")
    return "\n".join(lines)


def call_llm(messages: list, tools: list, api_key: str | None = None):
    if OpenAI is None:
        raise RuntimeError("openai sdk 不可用")
    client = OpenAI(api_key=api_key or os.getenv("DEEPSEEK_API_KEY"), base_url=BASE_URL)
    return client.chat.completions.create(
        model=MODEL, messages=messages, tools=tools,
        temperature=TEMP, max_tokens=MAX_TOKENS,
    )
