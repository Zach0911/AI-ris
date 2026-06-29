"""GHA 入口编排 —— 加载历史→感知→跟踪旧建议→算胜率→研判→生成建议→落盘。

三层降级：无 key→mock_judge；DeepSeek 失败→mock_judge 记错；
yfinance 失败→沿用上次快照指标 + mock。任何情况都产出快照，断网不空白。
落盘三文件：data/agent-history.json（全量，跨 run 持久化）、
data/agent-latest.json + src/agentData.js（前端读，后者为内置兜底）。
"""
from __future__ import annotations

import datetime as dt
import json
import os
from pathlib import Path

from . import datafeed, judge, tracker

ROOT = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT / "data"
HISTORY_FILE = DATA_DIR / "agent-history.json"
LATEST_FILE = DATA_DIR / "agent-latest.json"
AGENTDATA_FILE = ROOT / "src" / "agentData.js"
TICKER = os.getenv("AGENT_TICKER", "QQQ")


def _now_iso() -> str:
    return dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def load_history() -> list[dict]:
    if HISTORY_FILE.exists():
        try:
            return json.loads(HISTORY_FILE.read_text()).get("suggestions", [])
        except Exception:
            return []
    return []


def save_history(suggestions: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    HISTORY_FILE.write_text(
        json.dumps({"suggestions": suggestions, "updatedAt": _now_iso()},
                   ensure_ascii=False, indent=2)
    )


def _load_last_indicators() -> dict | None:
    if LATEST_FILE.exists():
        try:
            d = json.loads(LATEST_FILE.read_text())
            return d.get("latestRun", {}).get("indicators")
        except Exception:
            return None
    return None


def _build_payload(ticker: str, snapshot: dict | None, result: dict,
                  history: list[dict], data_ok: bool) -> dict:
    trace = result.get("trace", [])
    last = trace[-1] if trace else {"thought": "", "action": "", "observation": ""}
    mode = result.get("mode", "mock")
    src = "AI 研判（DeepSeek live）" if mode == "live" else "规则降级（mock）"
    src += f" | 数据 yfinance {ticker} 日线 | 收盘价判定结局"
    if not data_ok:
        src += " | 本次取数失败，沿用上次快照"
    indicators = snapshot["indicators"] if snapshot else None
    return {
        "agent": {
            "ticker": ticker,
            "lastRun": _now_iso(),
            "mode": mode,
            "iterations": result.get("iterations", 0),
            "error": result.get("error"),
        },
        "latestRun": {
            "thought": last.get("thought", ""),
            "action": last.get("action", ""),
            "observation": last.get("observation", ""),
            "asOfDate": snapshot.get("asOfDate", "") if snapshot else "",
            "indicators": indicators,
            "trace": trace,
        },
        "currentSuggestion": tracker.get_current_suggestion(history),
        "winRate": tracker.calc_win_rate(history),
        "history": tracker.get_recent_suggestions(history, 20),
        "sourceNote": src,
    }


def _persist(payload: dict, history: list[dict]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    LATEST_FILE.write_text(json.dumps(payload, ensure_ascii=False, indent=2))
    AGENTDATA_FILE.parent.mkdir(exist_ok=True)
    AGENTDATA_FILE.write_text(
        "export const agentData = " + json.dumps(payload, ensure_ascii=False, indent=2) + ";\n"
    )
    save_history(history)


def run(ticker: str = TICKER, api_key: str | None = None) -> dict:
    history = load_history()
    snapshot = None
    data_ok = True

    try:
        snapshot = datafeed.get_market_snapshot(ticker)
    except Exception as e:
        data_ok = False
        last_ind = _load_last_indicators()
        if last_ind is None:
            result = {"mode": "mock", "iterations": 0, "trace": [],
                      "suggestion": None, "error": f"取数失败且无历史快照: {e}"}
            payload = _build_payload(ticker, None, result, history, False)
            _persist(payload, history)
            return payload
        snapshot = {
            "ticker": ticker,
            "asOfDate": last_ind.get("date", ""),
            "eligibleCloseDate": last_ind.get("date", ""),
            "price": last_ind.get("price", 0.0),
            "indicators": last_ind,
        }

    # 跟踪旧建议结局（收盘价口径）
    try:
        closes = datafeed.fetch_close_prices(ticker, 120)
        tracker.resolve_open_suggestions(history, closes)
    except Exception:
        pass  # 取数失败则本轮跳过跟踪

    # 跑 Agent Loop：取数正常走 live/mock，取数失败强制 mock
    if data_ok:
        result = judge.run_agent_loop(snapshot, history, api_key=api_key)
    else:
        result = judge.mock_judge(snapshot, history, error="yfinance 取数失败，降级 mock")

    # 同时只允许一条 open 建议：无 open 时才追加新建议
    new_sug = result.get("suggestion")
    if new_sug and tracker.get_current_suggestion(history) is None:
        history.append(new_sug)

    payload = _build_payload(ticker, snapshot, result, history, data_ok)
    _persist(payload, history)
    return payload


def main() -> None:
    payload = run(TICKER, api_key=os.getenv("DEEPSEEK_API_KEY"))
    a = payload["agent"]
    print(f"[agent] ticker={a['ticker']} mode={a['mode']} iterations={a['iterations']} "
          f"suggestion={bool(payload.get('currentSuggestion'))} "
          f"history={len(payload['history'])} error={a['error']}")


if __name__ == "__main__":
    main()
