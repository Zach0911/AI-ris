"""交易建议生成与风控 —— 「风控不过 LLM」。

LLM 只给方向/信心度/理由，进场价用当前收盘价，止损=ATR×2、止盈=ATR×3，
仓位按「单笔风险=2% 组合」反推并封顶，避免高波动标的被迫上杠杆。
validate_suggestion 给建议打 quality 徽章与 qualityFlags（趋势强度/波动区间/超买超卖/信心度）。
"""
from __future__ import annotations

import datetime as dt
import uuid

RISK_PCT = 0.02          # 单笔最大风险 = 组合的 2%
MAX_POSITION_PCT = 0.25   # 单标的最多占组合 25%（封顶，防 ATR 停损过紧逼出杠杆）
HORIZON_MAX_DAYS = {"swing": 10, "trend": 20}


def _now_iso() -> str:
    return dt.datetime.now(dt.UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z")


def build_suggestion(snapshot: dict, direction: str, horizon: str, confidence: int,
                      reasoning: str, thought: str = "") -> dict | None:
    """根据快照与 LLM 决策构造带风控的建议。direction=flat 返回 None（HOLD）。"""
    if direction not in ("long", "short", "flat"):
        raise ValueError(f"invalid direction: {direction}")
    if horizon not in HORIZON_MAX_DAYS:
        horizon = "swing"
    if direction == "flat":
        return None

    price = float(snapshot["price"])
    atr = float(snapshot["indicators"]["atr"])
    if atr <= 0:
        return None
    issued_close = snapshot.get("eligibleCloseDate") or snapshot["indicators"]["date"]

    if direction == "long":
        stop = price - atr * 2
        target = price + atr * 3
    else:  # short
        stop = price + atr * 2
        target = price - atr * 3

    risk_per_share = abs(price - stop)
    raw_pct = RISK_PCT * price / risk_per_share if risk_per_share > 0 else 0.0
    size_pct = min(raw_pct, MAX_POSITION_PCT)

    sug = {
        "id": uuid.uuid4().hex[:12],
        "ticker": snapshot["ticker"],
        "createdAt": _now_iso(),
        "issuedAtClose": issued_close,
        "direction": direction,
        "horizon": horizon,
        "entry": round(price, 2),
        "stop": round(stop, 2),
        "target": round(target, 2),
        "sizePct": round(size_pct * 100, 2),
        "atr": round(atr, 4),
        "confidence": int(confidence),
        "reasoning": reasoning,
        "thought": thought,
        "quality": None,
        "qualityFlags": [],
        "status": "open",
        "resolvedAt": None,
        "resolvedPrice": None,
        "resolution": None,
        "daysOpen": 0,
        "maxDays": HORIZON_MAX_DAYS[horizon],
    }
    quality, flags = validate_suggestion(sug, snapshot["indicators"])
    sug["quality"] = quality
    sug["qualityFlags"] = flags
    return sug


def validate_suggestion(sug: dict, indicators: dict) -> tuple[str, list[str]]:
    """打 quality 徽章（high/medium/low）与 qualityFlags 列表。"""
    direction = sug["direction"]
    if direction == "flat":
        return "n/a", []

    flags: list[str] = []
    atr_pct = float(indicators.get("atrPct", 0) or 0)
    adx = float(indicators.get("adx", 0) or 0)
    rsi = float(indicators.get("rsi", 50) or 50)
    confidence = int(sug.get("confidence", 0) or 0)

    if atr_pct > 3.0:
        flags.append("atr_too_wide")
    if atr_pct < 0.15:
        flags.append("atr_too_narrow")
    if adx < 18:
        flags.append("choppy_adx_low")
    if direction == "long" and rsi > 75:
        flags.append("rsi_overbought")
    if direction == "short" and rsi < 25:
        flags.append("rsi_oversold")
    if confidence < 50:
        flags.append("low_confidence")

    if not flags and confidence >= 70 and adx >= 20:
        quality = "high"
    elif len(flags) <= 2:
        quality = "medium"
    else:
        quality = "low"
    return quality, flags
