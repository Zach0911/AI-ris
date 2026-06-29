import { agentData as fallbackData } from "./agentData.js";

const DIR_TEXT = { long: "看多", short: "看空", flat: "观望" };
const DIR_CLASS = { long: "agent-up", short: "agent-down", flat: "agent-flat" };
const DIR_ARROW = { long: "▲", short: "▼", flat: "—" };
const STATUS_TEXT = { open: "跟踪中", win: "止盈", loss: "止损", expired: "超时", flat: "观望" };
const STATUS_CLASS = { open: "agent-st-open", win: "agent-st-win", loss: "agent-st-loss", expired: "agent-st-expired", flat: "agent-st-flat" };
const HORIZON_TEXT = { swing: "波段", trend: "趋势" };
const QUALITY_TEXT = { high: "高质量", medium: "中等", low: "低质量", "n/a": "—" };
const QUALITY_CLASS = { high: "agent-q-high", medium: "agent-q-mid", low: "agent-q-low", "n/a": "agent-q-na" };
const CONF_BUCKET_TEXT = { low: "低信心(<40)", mid: "中信心(40-70)", high: "高信心(≥70)" };
const MODE_TEXT = { live: "AI 研判（DeepSeek 实时）", mock: "规则降级" };
const MODE_CLASS = { live: "agent-mode-live", mock: "agent-mode-mock" };
const FLAG_TEXT = {
  atr_too_wide: "波动过大",
  atr_too_narrow: "波动过小",
  choppy_adx_low: "趋势不明",
  rsi_overbought: "超买",
  rsi_oversold: "超卖",
  low_confidence: "信心不足",
};

function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function fmt(n, d = 2) {
  if (n === null || n === undefined || n === "" || Number.isNaN(Number(n))) return "—";
  return Number(n).toFixed(d);
}

function fmtBeijing(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso).replace("T", " ").slice(0, 16);
  const b = new Date(d.getTime() + 8 * 3600 * 1000);
  const p = (n) => String(n).padStart(2, "0");
  return `${b.getUTCFullYear()}-${p(b.getUTCMonth() + 1)}-${p(b.getUTCDate())} ${p(b.getUTCHours())}:${p(b.getUTCMinutes())}`;
}

function isValidSnapshot(s) {
  return Boolean(s && s.agent && s.latestRun && s.winRate && Array.isArray(s.history));
}

function renderHeader(a) {
  const mode = a.mode || "mock";
  const cls = MODE_CLASS[mode] || MODE_CLASS.mock;
  const txt = MODE_TEXT[mode] || mode;
  const last = fmtBeijing(a.lastRun);
  const err = a.error ? `<span class="agent-err">⚠ ${escapeHtml(a.error)}</span>` : "";
  return `<div class="agent-head">
    <div class="agent-head-main">
      <h2>${escapeHtml(a.ticker || "QQQ")} 趋势研判</h2>
      <span class="agent-mode ${cls}">${escapeHtml(txt)}</span>
    </div>
    <div class="agent-head-meta">
      <span>最近运行 ${escapeHtml(last)}</span>
      <span>迭代 ${a.iterations ?? 0} 轮</span>
      ${err}
    </div>
  </div>`;
}

function renderDecision(r) {
  const trace = Array.isArray(r.trace) ? r.trace : [];
  const cards = trace.length ? trace.map((t, i) => `
    <div class="agent-trace-step">
      <div class="agent-trace-no">${i + 1}</div>
      <div class="agent-trace-body">
        <div class="agent-thought"><b>Thought</b><p>${escapeHtml(t.thought || "—")}</p></div>
        <div class="agent-action"><b>Action</b><p>${escapeHtml(t.action || "—")}</p></div>
        <div class="agent-obs"><b>Observation</b><p>${escapeHtml(t.observation || "—")}</p></div>
      </div>
    </div>`).join("") : `
    <div class="agent-trace-step">
      <div class="agent-trace-no">1</div>
      <div class="agent-trace-body">
        <div class="agent-thought"><b>Thought</b><p>${escapeHtml(r.thought || "—")}</p></div>
        <div class="agent-action"><b>Action</b><p>${escapeHtml(r.action || "—")}</p></div>
        <div class="agent-obs"><b>Observation</b><p>${escapeHtml(r.observation || "—")}</p></div>
      </div>
    </div>`;
  return `<div class="agent-block">
    <h3>本轮研判（Thought → Action → Observation）</h3>
    <div class="agent-trace">${cards}</div>
  </div>`;
}

function renderIndicators(ind) {
  if (!ind) return "";
  const rows = [
    ["收盘价", fmt(ind.price), `相对 EMA20 ${fmt(ind.ema20Pct)}% · 相对 EMA60 ${fmt(ind.ema60Pct)}%`],
    ["均线", `EMA20 ${fmt(ind.ema20)} / EMA60 ${fmt(ind.ema60)}`, ind.emaCross === "golden" ? "金叉" : ind.emaCross === "death" ? "死叉" : "未交叉"],
    ["RSI(14)", fmt(ind.rsi, 1), ind.rsi > 70 ? "超买区" : ind.rsi < 30 ? "超卖区" : "中性区"],
    ["ADX(14)", fmt(ind.adx, 1), `+DI ${fmt(ind.plusDi, 1)} / -DI ${fmt(ind.minusDi, 1)}`],
    ["ATR(14)", fmt(ind.atr), `占价 ${fmt(ind.atrPct)}%`],
    ["MACD", `柱 ${fmt(ind.macdHist, 3)}`, ind.macdHist > 0 ? "多头动能" : "空头动能"],
    ["量比", fmt(ind.volumeRatio), ind.volumeRatio > 1.3 ? "放量" : ind.volumeRatio < 0.7 ? "缩量" : "正常"],
  ];
  return `<div class="agent-block">
    <h3>当前指标快照 <small>${escapeHtml(ind.date || "")}</small></h3>
    <div class="agent-ind-grid">
      ${rows.map(([k, v, n]) => `<div class="agent-ind"><span>${escapeHtml(k)}</span><b>${escapeHtml(v)}</b><small>${escapeHtml(n)}</small></div>`).join("")}
    </div>
  </div>`;
}

function renderSuggestion(s) {
  if (!s) {
    return `<div class="agent-block">
      <h3>当前建议</h3>
      <div class="agent-sug-empty">当前无持仓建议，Agent 本轮选择观望（HOLD）或等待下次研判。</div>
    </div>`;
  }
  const dir = s.direction;
  const dirCls = DIR_CLASS[dir] || DIR_CLASS.flat;
  const dirTxt = DIR_TEXT[dir] || "—";
  const arrow = DIR_ARROW[dir] || "—";
  const hor = HORIZON_TEXT[s.horizon] || s.horizon || "—";
  const qCls = QUALITY_CLASS[s.quality] || QUALITY_CLASS["n/a"];
  const qTxt = QUALITY_TEXT[s.quality] || "—";
  const flags = (s.qualityFlags || []).map((f) => `<span class="agent-flag">${escapeHtml(FLAG_TEXT[f] || f)}</span>`).join("");
  const pct = Math.min(100, Math.round((s.daysOpen / Math.max(1, s.maxDays)) * 100));
  const statusTxt = STATUS_TEXT[s.status] || s.status;
  const statusCls = STATUS_CLASS[s.status] || STATUS_CLASS.flat;
  return `<div class="agent-block agent-sug-block">
    <h3>当前建议 <span class="agent-sug-status ${statusCls}">${escapeHtml(statusTxt)}</span></h3>
    <div class="agent-sug ${dirCls}">
      <div class="agent-sug-dir">
        <span class="agent-dir-arrow">${arrow}</span>
        <div>
          <b>${escapeHtml(dirTxt)}</b>
          <small>${escapeHtml(hor)} · 信心度 ${s.confidence ?? 0}%</small>
        </div>
      </div>
      <div class="agent-sug-quality ${qCls}">${escapeHtml(qTxt)}</div>
      <div class="agent-sug-prices">
        <div><span>进场</span><b>${fmt(s.entry)}</b></div>
        <div><span>止损</span><b class="agent-down">${fmt(s.stop)}</b></div>
        <div><span>止盈</span><b class="agent-up">${fmt(s.target)}</b></div>
        <div><span>仓位</span><b>${fmt(s.sizePct, 1)}%</b></div>
      </div>
      <div class="agent-sug-reason">${escapeHtml(s.reasoning || "—")}</div>
      ${flags ? `<div class="agent-flags">${flags}</div>` : ""}
      <div class="agent-sug-progress">
        <div class="agent-progress-bar"><i style="width:${pct}%"></i></div>
        <span>已持有 ${s.daysOpen ?? 0} / ${s.maxDays ?? 0} 天 · 建仓日 ${escapeHtml(s.issuedAtClose || "—")}${s.resolvedAt ? ` · 结算 ${escapeHtml(s.resolvedAt)} @ ${fmt(s.resolvedPrice)}` : ""}</span>
      </div>
    </div>
  </div>`;
}

function breakdownItem(label, g) {
  if (!g) return "";
  const n = (g.wins || 0) + (g.losses || 0);
  if (!n) return "";
  const wr = g.winRate ?? 0;
  return `<div class="agent-wr-item">
    <span>${escapeHtml(label)}</span>
    <b>${wr}%</b>
    <small>${g.wins || 0}胜 ${g.losses || 0}负</small>
  </div>`;
}

function renderWinRate(wr) {
  if (!wr) return "";
  const big = wr.winRate === null || wr.winRate === undefined;
  const bigTxt = big ? "积累中" : `${wr.winRate}%`;
  const bigCls = big ? "agent-wr-pending" : (wr.winRate >= 55 ? "agent-up" : wr.winRate >= 45 ? "" : "agent-down");
  const r10 = wr.recent10 || {};
  const r10Txt = r10.count ? `${r10.winRate ?? 0}%` : "—";
  return `<div class="agent-block">
    <h3>历史胜率（收盘价口径，触达止盈/止损结算）</h3>
    <div class="agent-wr-grid">
      <div class="agent-wr-big ${bigCls}">
        <span>总胜率</span>
        <b>${escapeHtml(bigTxt)}</b>
        <small>${wr.decided ?? 0} 已结算${wr.decided < 5 ? " · 需≥5 条" : ""} · 含 ${wr.expired ?? 0} 超时</small>
      </div>
      <div class="agent-wr-side">
        <div class="agent-wr-item"><span>近 10 条</span><b>${escapeHtml(r10Txt)}</b><small>${r10.count ?? 0} 条</small></div>
        ${breakdownItem("看多", (wr.byDirection || {}).long)}
        ${breakdownItem("看空", (wr.byDirection || {}).short)}
        ${breakdownItem("波段", (wr.byHorizon || {}).swing)}
        ${breakdownItem("趋势", (wr.byHorizon || {}).trend)}
        ${breakdownItem(CONF_BUCKET_TEXT.low, (wr.byConfidence || {}).low)}
        ${breakdownItem(CONF_BUCKET_TEXT.mid, (wr.byConfidence || {}).mid)}
        ${breakdownItem(CONF_BUCKET_TEXT.high, (wr.byConfidence || {}).high)}
      </div>
    </div>
  </div>`;
}

function renderHistoryTable(history) {
  if (!Array.isArray(history) || !history.length) {
    return `<div class="agent-block"><h3>建议跟踪</h3><div class="agent-sug-empty">暂无历史建议，Agent 首次运行后会在此累积。</div></div>`;
  }
  const rows = history.map((s) => {
    const dirCls = DIR_CLASS[s.direction] || DIR_CLASS.flat;
    const dirTxt = DIR_TEXT[s.direction] || s.direction || "—";
    const hor = HORIZON_TEXT[s.horizon] || s.horizon || "—";
    const statusTxt = STATUS_TEXT[s.status] || s.status || "—";
    const statusCls = STATUS_CLASS[s.status] || STATUS_CLASS.flat;
    return `<tr>
      <td>${escapeHtml(s.issuedAtClose || "—")}</td>
      <td><span class="agent-dir-pill ${dirCls}">${escapeHtml(dirTxt)}</span></td>
      <td>${escapeHtml(hor)}</td>
      <td>${s.confidence ?? 0}%</td>
      <td>${fmt(s.entry)}</td>
      <td>${fmt(s.stop)}</td>
      <td>${fmt(s.target)}</td>
      <td>${fmt(s.sizePct, 1)}%</td>
      <td><span class="agent-status-pill ${statusCls}">${escapeHtml(statusTxt)}</span></td>
      <td>${s.resolvedPrice != null ? fmt(s.resolvedPrice) : "—"}</td>
      <td>${s.daysOpen ?? 0}/${s.maxDays ?? 0}</td>
    </tr>`;
  }).join("");
  return `<div class="agent-block">
    <h3>建议跟踪（最近 ${history.length} 条）</h3>
    <div class="agent-table-wrap">
      <table class="agent-table">
        <thead><tr>
          <th>建仓日</th><th>方向</th><th>周期</th><th>信心</th>
          <th>进场</th><th>止损</th><th>止盈</th><th>仓位</th>
          <th>状态</th><th>结算价</th><th>天数</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  </div>`;
}

function render(s) {
  const el = document.getElementById("agent-panel");
  if (!el) return;
  const a = s.agent || {};
  const r = s.latestRun || {};
  el.innerHTML = `
    ${renderHeader(a)}
    ${renderDecision(r)}
    ${renderIndicators(r.indicators)}
    ${renderSuggestion(s.currentSuggestion)}
    ${renderWinRate(s.winRate)}
    ${renderHistoryTable(s.history)}
    <p class="agent-disclaimer">免责声明：本页内容由 AI Agent 基于公开行情与规则/LLM 研判自动生成，仅作技术研究与自用跟踪，不构成任何投资建议。建议以收盘价口径模拟跟踪，不涉及真实下单。市场有风险，据此操作盈亏自负。</p>
    <p class="agent-source">${escapeHtml(s.sourceNote || "")}</p>`;
}

async function loadLatest() {
  try {
    const res = await fetch("./data/agent-latest.json", { cache: "no-store" });
    if (!res.ok) return fallbackData;
    const latest = await res.json();
    return isValidSnapshot(latest) ? latest : fallbackData;
  } catch {
    return fallbackData;
  }
}

export async function initAgent() {
  const snapshot = await loadLatest();
  render(snapshot);
}

initAgent().catch((err) => {
  console.error("agent render failed", err);
});
