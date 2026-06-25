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

// Card detail shown in a centered modal (not inline expand) so it doesn't push
// the layout down. Detail HTML per factor is cached at render time; the ? button
// opens the modal by key.
const detailCache = {};

window.factorsOpenDetail = function (key) {
  const html = detailCache[key];
  if (!html) return;
  let mask = document.getElementById("factors-modal-mask");
  if (!mask) {
    mask = document.createElement("div");
    mask.id = "factors-modal-mask";
    mask.className = "factors-modal-mask";
    mask.addEventListener("click", (e) => { if (e.target === mask) window.factorsCloseDetail(); });
    document.body.appendChild(mask);
  }
  mask.innerHTML = `<div class="factors-modal" role="dialog" aria-modal="true">
    <button class="factors-modal-close" type="button" aria-label="关闭" onclick="factorsCloseDetail()">×</button>
    ${html}
  </div>`;
  mask.classList.add("factors-modal-open");
  document.body.style.overflow = "hidden";
};

window.factorsCloseDetail = function () {
  const mask = document.getElementById("factors-modal-mask");
  if (mask) mask.classList.remove("factors-modal-open");
  document.body.style.overflow = "";
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") window.factorsCloseDetail();
});

function renderSparkline(pts, opts = {}) {
  const height = opts.large ? 120 : 24;
  if (!Array.isArray(pts) || pts.length < 2) {
    return `<div class="factors-spark factors-spark-pending">历史累积中</div>`;
  }
  const stroke = opts.color || "var(--primary)";
  const vals = pts.map((p) => Number(p.value));
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const n = vals.length;
  const pad = 2;
  const xy = vals.map((v, i) => {
    const x = n === 1 ? 50 : (i / (n - 1)) * 100;
    const y = mx === mn ? height / 2
      : height - ((v - mn) / (mx - mn)) * (height - pad * 2) - pad;
    return [x, y];
  });
  const points = xy.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(" ");
  const [lastX, lastY] = xy[xy.length - 1];
  const dotTopPct = (lastY / height) * 100;
  const cls = opts.large ? "factors-chart" : "factors-spark";
  return `<div class="factors-spark-wrap">
    <svg class="${cls}" viewBox="0 0 100 ${height}" preserveAspectRatio="none">
      <polyline points="${points}" fill="none" stroke="${stroke}"
        stroke-width="${opts.large ? 2 : 1.5}" stroke-linejoin="round"
        stroke-linecap="round" vector-effect="non-scaling-stroke"/>
    </svg>
    <span class="factors-spark-dot" style="top:${dotTopPct.toFixed(1)}%;background:${stroke}"></span>
  </div>`;
}

function renderHistoryTable(pts) {
  if (!Array.isArray(pts) || pts.length < 2) return "";
  const rows = pts.slice(0, 8).map((p) => `
    <tr><td>${escapeHtml(p.date || "")}</td><td>${escapeHtml(String(p.value ?? ""))}</td></tr>`).join("");
  return `<table class="factors-history-table">
    <thead><tr><th>日期</th><th>值</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>`;
}

function renderExplainer(e) {
  if (!e) return "";
  const framework = (e.framework || []).map((f) => `
    <div class="factors-explainer-item">
      <b>${escapeHtml(f.factor || "")}</b>
      <span>${escapeHtml(f.role || "")}</span>
    </div>`).join("");
  const howTo = (e.howToRead || []).map((h) => `
    <li><b>${escapeHtml(h.part || "")}</b>：${escapeHtml(h.what || "")}</li>`).join("");
  return `
    <details class="factors-explainer">
      <summary>三因子框架说明（点开看怎么读这张图）</summary>
      <p class="factors-explainer-summary">${escapeHtml(e.summary || "")}</p>
      <div class="factors-explainer-framework">${framework}</div>
      <h4>怎么看这张图</h4>
      <ul class="factors-explainer-howto">${howTo}</ul>
    </details>`;
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
  const ex = ind.explain || {};
  detailCache[key] = `
    <div class="factors-modal-title">${escapeHtml(ind.label)}<b>${escapeHtml(ind.name)}</b></div>
    <div class="factors-explain-block">
      <div class="factors-explain-row"><b>是什么</b><span>${escapeHtml(ex.definition || "")}</span></div>
      <div class="factors-explain-row"><b>当前</b><span>${escapeHtml(ex.current || "")}</span></div>
      <div class="factors-explain-row"><b>阈值参考</b><span>${escapeHtml(ex.threshold || "")}</span></div>
    </div>
    <div class="factors-explain-chart">${renderSparkline(ind.history, { large: true, color })}</div>
    ${renderHistoryTable(ind.history)}`;
  return `
    <div class="factors-card">
      <div class="factors-card-head">
        <div class="factors-card-name">${escapeHtml(ind.label)}<b>${escapeHtml(ind.name)}</b></div>
        <button class="factors-card-q" type="button" aria-label="展开指标说明"
          onclick="factorsOpenDetail('${key}')">?</button>
      </div>
      <div class="factors-val">${ind.value}<small>${escapeHtml(ind.unit || "")}</small></div>
      <div class="factors-delta">${escapeHtml(ind.directionText || "")} · ${escapeHtml(ind.delta || ind.note || "")}</div>
      ${renderSparkline(ind.history, { color })}
      <div class="factors-meter">
        <i style="left:0;width:${meter}%;background:linear-gradient(90deg,var(--muted),var(--primary),var(--green))"></i>
        <div class="factors-needle" style="left:${meter}%"></div>
      </div>
      <div class="factors-scale">${scale}</div>
      <div class="factors-tag" style="color:${color}">${escapeHtml(ind.directionText || "")}</div>
      <div class="factors-hint">${escapeHtml(ind.hint || "")}</div>
    </div>`;
}

// Direction text → small arrow glyph for the colored chips.
const DIR_ARROW = { up: "↑", down: "↓", flat: "→" };

function renderStateCard(r) {
  const tone = TONE_CLASS[r.tone] || TONE_CLASS.chop;
  const chips = [
    { label: "TNX", text: r.tnx, sent: r.tnxSentiment },
    { label: "EPS", text: r.eps, sent: r.epsSentiment },
    { label: "NVDA", text: r.nvda, sent: r.nvdaSentiment },
  ].map((c) => `<span class="factors-chip factors-chip-${c.sent}">
      <b>${c.label}</b> ${DIR_ARROW[c.sent] || ""} ${escapeHtml(c.text)}
    </span>`).join("");
  return `
    <div class="factors-state-card ${tone}">
      <div class="factors-state-head">
        <span class="factors-state-pill">${escapeHtml(r.state)}</span>
        <span class="factors-state-desc">${escapeHtml(r.desc || "")}</span>
      </div>
      <div class="factors-state-chips">${chips}</div>
      <p class="factors-state-reason">${escapeHtml(r.reason || "")}</p>
      <div class="factors-state-action">建议：<b>${escapeHtml(r.action || "")}</b></div>
    </div>`;
}

function renderMatrix(rows) {
  const active = rows.find((r) => r.active) || rows[0];
  const others = rows.filter((r) => !r.active);
  const legend = others.map((r) => {
    const dots = ["tnxSentiment", "epsSentiment", "nvdaSentiment"]
      .map((k) => `<i class="factors-dot factors-dot-${r[k]}"></i>`).join("");
    return `
      <div class="factors-legend-item">
        <span class="factors-legend-dots">${dots}</span>
        <span class="factors-legend-name">${escapeHtml(r.state)}</span>
        <span class="factors-legend-desc">${escapeHtml(r.desc || "")}</span>
      </div>`;
  }).join("");
  return `
    <div class="factors-section">
      <h3>三因子信号矩阵 <span class="factors-tip">三因子方向组合 → 市场状态的查找表</span></h3>
      ${active ? renderStateCard(active) : ""}
      <details class="factors-matrix-others">
        <summary>查看其他 ${others.length} 种可能状态（参考）</summary>
        <div class="factors-legend-list">${legend}</div>
      </details>
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
  const { verdict, indicators, alerts, matrix, pace, sourceNote, headline, updatedAt, modelExplainer } = s;
  el.innerHTML = `
    <div class="factors-head">
      <div class="factors-headline">${escapeHtml(headline || "")}</div>
      <div class="factors-updated">数据更新 ${escapeHtml((updatedAt || "").replace("T", " ").slice(0, 16))}</div>
    </div>
    ${renderExplainer(modelExplainer)}
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
