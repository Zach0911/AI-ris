"""建议跟踪与胜率统计 —— Agent 的「观察」与「记忆」。

resolve_open_suggestions：用每日收盘价判定每条 open 建议的结局
  （触达止盈=win / 触达止损=loss / 超时=expired），收盘价口径，不依赖盘中。
calc_win_rate：胜率口径 winRate=wins/(wins+losses) 排除 expired；
  recent10 含 expired 看近期趋势；不足 5 条已结算时 winRate 返 null。
"""
from __future__ import annotations

CONFIDENCE_BUCKETS = {"low": (0, 40), "mid": (40, 70), "high": (70, 101)}


def _first_idx_after(closes: list[dict], issued_date: str) -> int:
    for i, c in enumerate(closes):
        if c["date"] > issued_date:
            return i
    return len(closes)


def resolve_open_suggestions(suggestions: list[dict], close_prices: list[dict]) -> bool:
    """遍历所有 open 建议，用 close_prices（升序）判定结局。返回是否有变更。"""
    changed = False
    for sug in suggestions:
        if sug["status"] != "open":
            continue
        issued = sug["issuedAtClose"]
        start = _first_idx_after(close_prices, issued)
        days = 0
        resolved = False
        for c in close_prices[start:]:
            days += 1
            close = c["close"]
            direction = sug["direction"]
            outcome = None
            if direction == "long":
                if close >= sug["target"]:
                    outcome = "win"
                elif close <= sug["stop"]:
                    outcome = "loss"
            else:  # short
                if close <= sug["target"]:
                    outcome = "win"
                elif close >= sug["stop"]:
                    outcome = "loss"

            if outcome:
                sug["status"] = outcome
                sug["resolvedAt"] = c["date"]
                sug["resolvedPrice"] = round(close, 2)
                sug["resolution"] = outcome
                sug["daysOpen"] = days
                changed = resolved = True
                break
            if days >= sug["maxDays"]:
                sug["status"] = "expired"
                sug["resolvedAt"] = c["date"]
                sug["resolvedPrice"] = round(close, 2)
                sug["resolution"] = "expired"
                sug["daysOpen"] = days
                changed = resolved = True
                break
        if not resolved:
            sug["daysOpen"] = days
    return changed


def _breakdown(decided: list[dict], key: str) -> dict:
    groups: dict[str, dict] = {}
    for s in decided:
        k = s.get(key, "unknown")
        g = groups.setdefault(k, {"wins": 0, "losses": 0})
        if s["status"] == "win":
            g["wins"] += 1
        elif s["status"] == "loss":
            g["losses"] += 1
    out = {}
    for k, g in groups.items():
        n = g["wins"] + g["losses"]
        out[k] = {"wins": g["wins"], "losses": g["losses"],
                  "winRate": round(g["wins"] / n * 100, 1) if n else None}
    return out


def _confidence_breakdown(decided: list[dict]) -> dict:
    out = {b: {"wins": 0, "losses": 0} for b in CONFIDENCE_BUCKETS}
    for s in decided:
        c = int(s.get("confidence", 0) or 0)
        for b, (lo, hi) in CONFIDENCE_BUCKETS.items():
            if lo <= c < hi:
                if s["status"] == "win":
                    out[b]["wins"] += 1
                elif s["status"] == "loss":
                    out[b]["losses"] += 1
                break
    res = {}
    for b, g in out.items():
        n = g["wins"] + g["losses"]
        res[b] = {"wins": g["wins"], "losses": g["losses"],
                  "winRate": round(g["wins"] / n * 100, 1) if n else None}
    return res


def calc_win_rate(suggestions: list[dict]) -> dict:
    resolved = [s for s in suggestions if s["status"] in ("win", "loss", "expired")]
    wins = [s for s in resolved if s["status"] == "win"]
    losses = [s for s in resolved if s["status"] == "loss"]
    expired = [s for s in resolved if s["status"] == "expired"]
    decided = wins + losses

    win_rate = round(len(wins) / len(decided) * 100, 1) if decided else None
    if len(decided) < 5:
        win_rate = None  # 样本不足，前端显「积累中」

    recent = sorted(
        resolved,
        key=lambda s: s.get("resolvedAt") or s.get("createdAt") or "",
        reverse=True,
    )[:10]
    recent_win_rate = None
    if recent:
        rw = [s for s in recent if s["status"] == "win"]
        recent_win_rate = round(len(rw) / len(recent) * 100, 1)

    return {
        "total": len(resolved),
        "wins": len(wins),
        "losses": len(losses),
        "expired": len(expired),
        "decided": len(decided),
        "winRate": win_rate,
        "recent10": {
            "winRate": recent_win_rate,
            "count": len(recent),
            "wins": len([s for s in recent if s["status"] == "win"]),
        },
        "byDirection": _breakdown(decided, "direction"),
        "byHorizon": _breakdown(decided, "horizon"),
        "byConfidence": _confidence_breakdown(decided),
    }


def get_recent_suggestions(suggestions: list[dict], limit: int = 20) -> list[dict]:
    return sorted(suggestions, key=lambda s: s.get("createdAt", ""), reverse=True)[:limit]


def get_current_suggestion(suggestions: list[dict]) -> dict | None:
    opens = [s for s in suggestions if s["status"] == "open"]
    return opens[0] if opens else None
