import { factorsData as fallbackData } from "./factorsData.js";

const TONE_CLASS = { bull: "factors-is-bull", bear: "factors-is-bear", chop: "factors-is-chop" };
const LIGHT_COLOR = {
  strong: "var(--green)", warn: "var(--amber)", weak: "var(--red)", neutral: "var(--muted)",
};

function isValidSnapshot(s) {
  return Boolean(s && s.verdict && s.indicators && s.indicators.tnx
    && s.indicators.nvda && s.indicators.eps && Array.isArray(s.matrix));
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

function renderVerdict(v) {
  const tone = TONE_CLASS[v.tone] || TONE_CLASS.chop;
  return `
    <div class="factors-verdict ${tone}">
      <div class="factors-verdict-light">${escapeHtml(v.light || "")}</div>
      <div class="factors-verdict-body">
        <div class="factors-eyebrow">市场状态判断</div>
        <h2>${escapeHtml(v.title || v.state || "")}</h2>
        <p>${escapeHtml(v.desc || "")}</p>
      </div>
      <div class="factors-verdict-action">
        <div class="factors-eyebrow">建议动作</div>
        <div class="factors-act">${escapeHtml(v.action || "")}</div>
        <div class="factors-conf">信心度 ${v.confidence ?? 0}%
          <span class="factors-bar"><i style="width:${v.confidence ?? 0}%"></i></span>
        </div>
      </div>
    </div>`;
}

function renderCard(key, ind) {
  const color = LIGHT_COLOR[ind.light] || LIGHT_COLOR.neutral;
  const meter = Math.max(0, Math.min(100, ind.meter ?? 50));
  const scale = (ind.meterScale || []).map((s) => `<span>${escapeHtml(s)}</span>`).join("");
  return `
    <div class="factors-card">
      <div class="factors-card-head">
        <div class="factors-card-name">${escapeHtml(ind.label)}<b>${escapeHtml(ind.name)}</b></div>
        <span class="factors-dot" style="background:${color};box-shadow:0 0 8px ${color}"></span>
      </div>
      <div class="factors-val">${ind.value}<small>${escapeHtml(ind.unit || "")}</small></div>
      <div class="factors-delta">${escapeHtml(ind.directionText || "")} · ${escapeHtml(ind.delta || ind.note || "")}</div>
      <div class="factors-meter">
        <i style="left:0;width:${meter}%;background:linear-gradient(90deg,var(--muted),var(--primary),var(--green))"></i>
        <div class="factors-needle" style="left:${meter}%"></div>
      </div>
      <div class="factors-scale">${scale}</div>
      <div class="factors-tag ${LIGHT_COLOR[ind.light] ? "" : ""}" style="color:${color}">${escapeHtml(ind.directionText || "")}</div>
      <div class="factors-hint">${escapeHtml(ind.hint || "")}</div>
    </div>`;
}

function renderMatrix(rows) {
  const body = rows.map((r) => `
    <tr class="${r.active ? "factors-active" : ""}">
      <td>${escapeHtml(r.tnx)}</td><td>${escapeHtml(r.eps)}</td><td>${escapeHtml(r.nvda)}</td>
      <td><span class="factors-pill factors-${TONE_CLASS[r.tone] || "factors-is-chop"}">${escapeHtml(r.state)}</span></td>
      <td>${escapeHtml(r.action)}</td>
    </tr>`).join("");
  return `
    <div class="factors-section">
      <h3>三因子信号矩阵 <span class="factors-tip">当前组合自动高亮</span></h3>
      <div class="factors-table-wrap">
        <table class="factors-matrix">
          <thead><tr><th>10Y 国债</th><th>Trailing EPS</th><th>NVDA 数据中心</th><th>市场状态</th><th>建议</th></tr></thead>
          <tbody>${body}</tbody>
        </table>
      </div>
    </div>`;
}

function renderAlerts(alerts) {
  return `<div class="factors-alerts">
    ${alerts.map((a) => `
      <div class="factors-alert">
        <div class="factors-alert-top">
          <b>${escapeHtml(a.title)}</b>
          <span class="factors-stat ${a.triggered ? "factors-fire" : "factors-ok"}">${escapeHtml(a.status)}</span>
        </div>
        <p>${escapeHtml(a.detail)}</p>
      </div>`).join("")}
  </div>`;
}

function renderPace(items) {
  return `
    <div class="factors-section">
      <h3>跟踪节奏 <span class="factors-tip">按频率跟踪 · 结论自动重算</span></h3>
      <div class="factors-pace">
        ${items.map((p) => `
          <div class="factors-pace-item">
            <div class="factors-freq">${escapeHtml(p.freq)}</div>
            <div class="factors-what">${escapeHtml(p.what)}</div>
            <div class="factors-det">${escapeHtml(p.det)}</div>
          </div>`).join("")}
      </div>
    </div>`;
}

function render(s) {
  const el = document.getElementById("factors-panel");
  if (!el) return;
  const { verdict, indicators, alerts, matrix, pace, sourceNote, headline, updatedAt } = s;
  el.innerHTML = `
    <div class="factors-head">
      <div class="factors-headline">${escapeHtml(headline || "")}</div>
      <div class="factors-updated">数据更新 ${escapeHtml((updatedAt || "").replace("T", " ").slice(0, 16))}</div>
    </div>
    ${renderVerdict(verdict)}
    <div class="factors-cards">
      ${renderCard("tnx", indicators.tnx)}
      ${renderCard("nvda", indicators.nvda)}
      ${renderCard("eps", indicators.eps)}
    </div>
    ${renderMatrix(matrix)}
    ${renderAlerts(alerts)}
    ${renderPace(pace)}
    <p class="factors-source">${escapeHtml(sourceNote || "")}</p>`;
}

async function loadLatest() {
  try {
    const res = await fetch("./data/factors-latest.json", { cache: "no-store" });
    if (!res.ok) return fallbackData;
    const latest = await res.json();
    return isValidSnapshot(latest) ? latest : fallbackData;
  } catch {
    return fallbackData;
  }
}

export async function initFactors() {
  const snapshot = await loadLatest();
  render(snapshot);
}

initFactors().catch((err) => {
  console.error("factors render failed", err);
});
