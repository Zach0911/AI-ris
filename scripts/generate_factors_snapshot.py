#!/usr/bin/env python3
"""Generate the US three-factor dashboard snapshot (fully automatic, no keys).

Three factors — all auto-fetched, no manual maintenance:
  - ^TNX 10Y Treasury yield: FRED DGS10 daily CSV (free, no key).
  - NVDA Data Center revenue YoY: SEC EDGAR latest 10-Q (parsed segment row).
  - SPX Trailing EPS YoY: multpl.com monthly EPS table (latest vs ~12mo ago).

EPS is trailing (TTM), not forward — a synchronous indicator, no free forward
source exists without a key. NVDA Data Center is the reportable market-platform
figure straight from the 10-Q.

Output:
  - data/factors-latest.json
  - src/factorsData.js  (baked-in fallback: `export const factorsData = {...}`)

Tolerant by design: if any source is unreachable, the previous snapshot is
preserved so the public page does not break.
"""

from __future__ import annotations

import argparse
import json
import re
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTFILE = ROOT / "data" / "factors-latest.json"
FALLBACK_JS = ROOT / "src" / "factorsData.js"
SEED = ROOT / "data" / "factors_seed.json"
BJT = timezone(timedelta(hours=8))

# --- FRED (^TNX) -------------------------------------------------------------
FRED_DGS10 = "https://fred.stlouisfed.org/graph/fredgraph.csv?id=DGS10&cosd={start}"
FRED_START = "2026-01-01"
FRED_TIMEOUT = 20
TNX_TREND_DAYS = 20         # trading days
TNX_TREND_THRESHOLD = 0.05  # percentage-point move to call it up/down

# --- SEC EDGAR (NVDA, CIK 0001045810) ---------------------------------------
SEC_SUBMISSIONS = "https://data.sec.gov/submissions/CIK0001045810.json"
SEC_DOC = "https://www.sec.gov/Archives/edgar/data/1045810/{acc}/{doc}"
SEC_TIMEOUT = 25

# --- multpl (SPX trailing EPS) ----------------------------------------------
MULTPL_EPS = "https://www.multpl.com/s-p-500-earnings/table/by-month"
MULTPL_TIMEOUT = 25
BROWSER_UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
              "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36")
EDGAR_UA = "AI-ris snapshot research@example.com"


# ---- 6-state signal matrix -------------------------------------------------
MATRIX: list[dict[str, str]] = [
    {"tnx": "down", "eps": "up", "nvda": "speed", "state": "主升牛市", "tone": "bull",
     "action": "维持 / 顺势仓位", "confidence": 85, "light": "🟢"},
    {"tnx": "down", "eps": "up", "nvda": "slow", "state": "扩散牛市", "tone": "bull",
     "action": "轮动 / 加仓非 AI", "confidence": 70, "light": "🟢"},
    {"tnx": "up", "eps": "up", "nvda": "speed", "state": "震荡偏强", "tone": "chop",
     "action": "持仓观望", "confidence": 55, "light": "🟡"},
    {"tnx": "up", "eps": "down", "nvda": "slow", "state": "主跌熊市", "tone": "bear",
     "action": "减仓 / 防御", "confidence": 80, "light": "🔴"},
    {"tnx": "down", "eps": "down", "nvda": "slow", "state": "防御熊", "tone": "bear",
     "action": "低配 / 现金为王", "confidence": 65, "light": "🔴"},
    {"tnx": "flat", "eps": "flat", "nvda": "hold", "state": "震荡市", "tone": "chop",
     "action": "波段 / 高抛低吸", "confidence": 45, "light": "🟡"},
]

DEFAULT_VERDICT = {
    "state": "震荡市", "title": "震荡市", "tone": "chop", "action": "波段 / 高抛低吸",
    "confidence": 45, "light": "🟡", "desc": "三因子相互抵消或均无方向，区间震荡，波段操作为主",
}

LABEL = {
    "tnx": {"down": "下行", "flat": "横盘", "up": "上行"},
    "nvda": {"speed": "加速", "hold": "高位持平", "slow": "减速"},
    "eps": {"up": "扩张", "flat": "横盘", "down": "转弱"},
}

LIGHT_KIND = {
    ("tnx", "down"): "strong", ("tnx", "flat"): "neutral", ("tnx", "up"): "warn",
    ("nvda", "speed"): "strong", ("nvda", "hold"): "warn", ("nvda", "slow"): "weak",
    ("eps", "up"): "strong", ("eps", "flat"): "warn", ("eps", "down"): "weak",
}

HINT = {
    "tnx": "分母端 · 定估值贴现率。快速上行杀估值，回落解压成长股",
    "nvda": "AI 景气 + 指数集中度。连续 2 季 QoQ 减速是顶部领先信号",
    "eps": "分子端 · 已实现盈利（TTM）。同步/滞后指标，同比转弱说明盈利开始减速",
}


# ---- helpers ---------------------------------------------------------------
def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))


def meter_pct(value: float, scale: list[float]) -> int:
    lo, hi = scale
    if hi <= lo:
        return 50
    return round(clamp((value - lo) / (hi - lo), 0, 1) * 100)


def http_get(url: str, timeout: int, ua: str = EDGAR_UA) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": ua})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", "ignore")


# ---- ^TNX (FRED DGS10) -----------------------------------------------------
def fetch_dgs10_series() -> list[tuple[str, float]]:
    url = FRED_DGS10.format(start=FRED_START)
    text = http_get(url, FRED_TIMEOUT)
    rows: list[tuple[str, float]] = []
    for line in text.splitlines()[1:]:
        parts = line.split(",")
        if len(parts) < 2:
            continue
        date_iso, raw = parts[0].strip(), parts[1].strip()
        if not raw:
            continue
        try:
            rows.append((date_iso, float(raw)))
        except ValueError:
            continue
    return rows


def classify_tnx(series: list[tuple[str, float]], cfg: dict[str, Any]) -> dict[str, Any]:
    lo52, hi52 = cfg["range52w"]
    if not series:
        raise RuntimeError("FRED DGS10 返回空序列")
    latest_date, latest = series[-1]
    window = series[-(TNX_TREND_DAYS + 1):]
    base = window[0][1] if len(window) >= 2 else series[0][1]
    delta = latest - base
    if delta <= -TNX_TREND_THRESHOLD:
        direction = "down"
    elif delta >= TNX_TREND_THRESHOLD:
        direction = "up"
    else:
        direction = "flat"
    move = round(delta, 2)
    return {
        "label": "^TNX",
        "name": "10 年期国债收益率",
        "value": latest,
        "unit": "%",
        "date": latest_date,
        "direction": direction,
        "directionText": LABEL["tnx"][direction],
        "delta": f"近 {TNX_TREND_DAYS} 日 {('+' if move >= 0 else '')}{move}pp · 52周 {lo52}–{hi52}%",
        "meter": meter_pct(latest, cfg["scale"]),
        "meterScale": cfg["scaleLabels"],
        "light": LIGHT_KIND[("tnx", direction)],
        "hint": HINT["tnx"],
        "source": "FRED DGS10",
    }


# ---- NVDA Data Center (SEC EDGAR 10-Q) -------------------------------------
def _fiscal_label(period: str) -> str:
    """NVDA fiscal year ends late January. '2026-04-26' -> 'FY27Q1'."""
    try:
        d = datetime.strptime(period, "%Y-%m-%d")
        m = d.month
        q = ((m - 2) % 12) // 3 + 1  # Feb -> Q1 ... Jan -> Q4
        fy = d.year + (1 if m >= 2 else 0)
        return f"FY{str(fy)[-2:]}Q{q}"
    except ValueError:
        return ""


def fetch_nvda_datacenter() -> dict[str, Any]:
    subs = json.loads(http_get(SEC_SUBMISSIONS, SEC_TIMEOUT))
    rec = subs["filings"]["recent"]
    forms = rec["form"]
    accs = rec["accessionNumber"]
    docs = rec["primaryDocument"]
    periods = rec["periodOfReport"]
    filed = rec["filingDate"]
    idx = next(i for i, f in enumerate(forms) if f == "10-Q")
    acc = accs[idx]
    doc = docs[idx]
    period = periods[idx]
    filing = filed[idx]

    html = http_get(SEC_DOC.format(acc=acc.replace("-", ""), doc=doc), SEC_TIMEOUT)
    text = re.sub(r"<[^>]+>", " ", html)
    text = re.sub(r"&#\d+;|&[a-z]+;", " ", text)
    text = re.sub(r"\s+", " ", text)
    # Quarterly Data Center row: 'Data Center $ cur $ prev_q $ yoy_q 21 % 92 %'
    m = re.search(
        r"Data Center\s+\$\s*([\d,]+)\s+\$\s*([\d,]+)\s+\$\s*([\d,]+)",
        text, re.I,
    )
    if not m:
        raise RuntimeError("NVDA 10-Q 未找到 Data Center 季度收入行")
    cur = float(m.group(1).replace(",", ""))
    prev_q = float(m.group(2).replace(",", ""))
    yoy_q = float(m.group(3).replace(",", ""))
    yoy = (cur - yoy_q) / yoy_q * 100
    qoq = (cur - prev_q) / prev_q * 100
    return {"cur": cur, "prev_q": prev_q, "yoy_q": yoy_q,
            "yoy": yoy, "qoq": qoq, "period": period, "filing": filing,
            "fiscal": _fiscal_label(period)}


def classify_nvda(dc: dict[str, Any], scale_labels: list[str]) -> dict[str, Any]:
    yoy, qoq = dc["yoy"], dc["qoq"]
    if qoq >= 5:        # 环比仍在加速
        direction = "speed"
    elif qoq <= 0:      # 环比转负 → 减速
        direction = "slow"
    else:
        direction = "hold"
    fiscal = f"（{dc['fiscal']}）" if dc["fiscal"] else ""
    return {
        "label": "NVDA",
        "name": "数据中心收入增速",
        "value": round(yoy),
        "unit": "% YoY",
        "asOf": f"{dc['period']}{fiscal}",
        "note": f"Data Center ${dc['cur'] / 1000:.1f}B · YoY {yoy:+.0f}% · QoQ {qoq:+.0f}%",
        "direction": direction,
        "directionText": LABEL["nvda"][direction],
        "delta": f"YoY {yoy:+.0f}% · QoQ {qoq:+.0f}% · 季度 ${dc['cur'] / 1000:.1f}B",
        "meter": meter_pct(yoy, [0, 100]),
        "meterScale": scale_labels,
        "light": LIGHT_KIND[("nvda", direction)],
        "hint": HINT["nvda"],
        "source": "SEC EDGAR 10-Q",
    }


# ---- SPX Trailing EPS (multpl) ---------------------------------------------
def fetch_spx_eps() -> dict[str, Any]:
    html = http_get(MULTPL_EPS, MULTPL_TIMEOUT, ua=BROWSER_UA)
    raw = re.findall(
        r"<tr[^>]*>\s*<td[^>]*>([^<]+)</td>\s*<td[^>]*>([^<]+)</td>", html)
    pts: list[tuple[Any, float]] = []
    for d_raw, v_raw in raw:
        d_clean = d_raw.strip()
        v_clean = v_raw.replace("&#x2002;", "").strip()
        try:
            dt = datetime.strptime(d_clean, "%b %d, %Y").date()
            v = float(v_clean)
        except ValueError:
            continue
        pts.append((dt, v))
    if not pts:
        raise RuntimeError("multpl EPS 表解析为空")
    pts.sort(key=lambda x: x[0], reverse=True)
    latest_dt, latest_v = pts[0]
    target = latest_dt - timedelta(days=330)
    baseline = next((p for p in pts if p[0] <= target), pts[min(12, len(pts) - 1)])
    yoy = (latest_v - baseline[1]) / baseline[1] * 100
    return {"latest_v": latest_v, "latest_dt": latest_dt,
            "base_v": baseline[1], "base_dt": baseline[0], "yoy": yoy}


def classify_eps(eps: dict[str, Any], scale_labels: list[str]) -> dict[str, Any]:
    yoy = eps["yoy"]
    if yoy > 2:
        direction = "up"
    elif yoy < -2:
        direction = "down"
    else:
        direction = "flat"
    return {
        "label": "SPX",
        "name": "Trailing EPS（TTM）",
        "value": round(yoy),
        "unit": "% YoY",
        "asOf": eps["latest_dt"].strftime("%Y-%m"),
        "note": (f"TTM EPS ${eps['latest_v']:.2f} vs ${eps['base_v']:.2f}"
                 f"（{eps['base_dt'].strftime('%Y-%m')}）"),
        "direction": direction,
        "directionText": LABEL["eps"][direction],
        "delta": f"YoY {yoy:+.1f}% · TTM ${eps['latest_v']:.2f}",
        "meter": meter_pct(yoy, [-10, 20]),
        "meterScale": scale_labels,
        "light": LIGHT_KIND[("eps", direction)],
        "hint": HINT["eps"],
        "source": "multpl",
    }


# ---- verdict / matrix / alerts ---------------------------------------------
def _v(state: str, tone: str, action: str, confidence: int, light: str, desc: str) -> dict[str, Any]:
    return {"light": light, "title": state, "state": state, "tone": tone,
            "action": action, "confidence": confidence, "desc": desc}


def pick_verdict(tnx_dir: str, eps_dir: str, nvda_dir: str) -> dict[str, Any]:
    """Classify any 3-factor combo into one named market state (maps all 27)."""
    if tnx_dir == "up" and eps_dir == "down" and nvda_dir == "slow":
        return _v("主跌熊市", "bear", "减仓 / 防御", 80, "🔴",
                  "利率上行 + 盈利同比转弱 + AI 减速三杀，估值与盈利双杀，主跌风险最高")
    if eps_dir == "down" and nvda_dir == "slow":
        return _v("防御熊", "bear", "低配 / 现金为王", 65, "🔴",
                  "利率回落利好抵不住盈利收缩，熊市下半场，防御为主")
    if eps_dir == "up" and nvda_dir == "speed" and tnx_dir != "up":
        return _v("主升牛市", "bull", "维持 / 顺势仓位", 85, "🟢",
                  "盈利同比扩张 + AI 景气加速 + 利率未压制，三因子同向偏多，主升逻辑延续")
    if eps_dir == "up" and nvda_dir == "slow":
        return _v("扩散牛市", "bull", "轮动 / 加仓非 AI", 70, "🟢",
                  "盈利仍增长但 AI 引擎减速，资金向其他板块扩散，行情 breadth 改善")
    if eps_dir == "up" and (tnx_dir == "up" or nvda_dir == "hold"):
        return _v("震荡偏强", "chop", "持仓观望", 55, "🟡",
                  "盈利扛住估值压力，但利率上行或 AI 持平抑制弹性，结构性机会为主")
    return _v("震荡市", "chop", "波段 / 高抛低吸", 45, "🟡",
              "三因子相互抵消或均无方向，区间震荡，波段操作为主")


def build_alerts(tnx: dict, eps: dict, nvda: dict, warn_threshold: float) -> list[dict[str, Any]]:
    a1_fire = nvda["direction"] == "slow" and eps["direction"] == "down"
    a2_fire = (tnx["direction"] == "up" and tnx["value"] >= warn_threshold
               and eps["direction"] != "up")
    return [
        {
            "id": "top1",
            "title": "顶部预警 ①　NVDA 减速 + EPS 转弱共振",
            "detail": ("NVDA 数据中心 QoQ 连续 2 季转负 且 trailing EPS 同比转弱 "
                       "→ AI 叙事 + 盈利双杀。注意 trailing 为同步指标，信号会比 "
                       "forward 滞后 1–2 季。最可靠的减仓信号。"),
            "triggered": a1_fire,
            "status": "触发" if a1_fire else "未触发",
        },
        {
            "id": "top2",
            "title": f"顶部预警 ②　利率破 {warn_threshold}% + EPS 未对冲",
            "detail": (f"TNX 突破 {warn_threshold}%（52周高点）且 trailing EPS 未同步扩张 "
                       "→ 估值压缩无盈利对冲，成长股压力最大。"),
            "triggered": a2_fire,
            "status": "触发" if a2_fire else "未触发",
        },
    ]


def build_matrix_rows(active_state: str) -> list[dict[str, Any]]:
    rows: list[dict[str, Any]] = []
    for row in MATRIX:
        rows.append({
            "tnx": LABEL["tnx"][row["tnx"]],
            "eps": LABEL["eps"][row["eps"]],
            "nvda": LABEL["nvda"][row["nvda"]],
            "state": row["state"],
            "tone": row["tone"],
            "action": row["action"],
            "active": (row["state"] == active_state
                       and not any(r["state"] == active_state and r["active"] for r in rows)),
        })
    return rows


PACE = [
    {"freq": "每日", "what": "^TNX 收盘 + 10Y–2Y 利差", "det": "破 4.5% 提高警惕，破 4.7% 预警"},
    {"freq": "每季", "what": "NVDA 数据中心 QoQ/YoY", "det": "10-Q 披露后 SEC EDGAR 自动取数"},
    {"freq": "每月", "what": "SPX trailing EPS 同比", "det": "multpl 月度更新，看方向而非绝对值"},
    {"freq": "触发式", "what": "任一指标连续 2 期反向", "det": "重估仓位，复看矩阵"},
]


def build_snapshot(seed: dict[str, Any]) -> dict[str, Any]:
    tnx = classify_tnx(fetch_dgs10_series(), seed["tnx"])
    nvda = classify_nvda(fetch_nvda_datacenter(), seed["nvdaScaleLabels"])
    eps = classify_eps(fetch_spx_eps(), seed["epsScaleLabels"])
    verdict = pick_verdict(tnx["direction"], eps["direction"], nvda["direction"])
    alerts = build_alerts(tnx, eps, nvda, seed["tnx"]["warnThreshold"])
    matrix_rows = build_matrix_rows(verdict["state"])
    return {
        "updatedAt": datetime.now(BJT).strftime("%Y-%m-%dT%H:%M:%S+08:00"),
        "date": datetime.now(BJT).strftime("%Y-%m-%d"),
        "headline": "EPS 决定牛熊 · TNX 决定估值弹性 · NVDA 决定指数弹性",
        "verdict": verdict,
        "indicators": {"tnx": tnx, "nvda": nvda, "eps": eps},
        "alerts": alerts,
        "matrix": matrix_rows,
        "pace": PACE,
        "sourceNote": (
            "三因子全部自动抓取、免 key、无需人工维护："
            "^TNX ← FRED DGS10 每日；NVDA 数据中心营收增速 ← SEC EDGAR 最新 10-Q 季度披露；"
            "SPX EPS ← multpl trailing TTM（同比口径，非 forward 预期，为同步指标）。"
            "结论由三因子方向组合经 6 态矩阵推断。任一源失败保留上次快照。"
        ),
    }


def write_outputs(snapshot: dict[str, Any]) -> None:
    payload = json.dumps(snapshot, ensure_ascii=False, indent=2)
    OUTFILE.write_text(payload, encoding="utf-8")
    FALLBACK_JS.write_text(f"export const factorsData = {payload};\n", encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="生成美股三因子跟踪看板快照")
    parser.add_argument("--seed", default=str(SEED), help="种子 JSON 路径")
    args = parser.parse_args()

    seed = json.loads(Path(args.seed).read_text(encoding="utf-8"))
    try:
        snapshot = build_snapshot(seed)
    except Exception as exc:
        if OUTFILE.exists():
            print(f"数据源失败（{exc}），保留旧快照：{OUTFILE}")
            return
        raise SystemExit(f"数据源失败且无旧快照：{exc}")
    write_outputs(snapshot)
    print(f"OK: {OUTFILE}")


if __name__ == "__main__":
    main()
