import { marketData as sampleData } from "./data.js";

let data = sampleData;

const state = {
  horizon: "short",
  signal: "all",
  query: "",
  selectedId: data.themes[0].id,
};

const horizonLabels = {
  short: "短期强弱",
  mid: "中期强弱",
  long: "长期强弱",
  all: "综合强弱",
};

const signalClass = {
  共振: "sync",
  传导: "lead",
  背离: "diverge",
};

const signalDescriptions = {
  共振: "美股主题ETF与A股ETF在多个周期同向走强或走弱，说明跨市场映射更顺畅，适合优先观察。",
  传导: "美股主题ETF已经先动，A股ETF尚未完全跟上，适合观察隔夜到A股开盘后的补涨或补跌传导。",
  背离: "美股主题ETF与A股ETF走势不同步或方向相反，说明本土因素影响更强，需要二次确认。",
};

const $ = (selector) => document.querySelector(selector);

function fmtPct(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function fmtAmount(value) {
  if (!value) return "-";
  return `${value.toFixed(1)}亿`;
}

function renderSignalPill(signal) {
  const description = signalDescriptions[signal] || "暂无信号说明。";
  return `<span class="signal-pill ${signalClass[signal]}" title="${description}" aria-label="${signal}：${description}">${signal}</span>`;
}

function getThemeScore(theme) {
  return theme.us.strength[state.horizon] ?? theme.us.strength.all;
}

function getFilteredThemes() {
  const query = state.query.trim().toLowerCase();
  return data.themes
    .filter((theme) => {
      const signalOk = state.signal === "all" || theme.signal === state.signal;
      const queryText = [
        theme.name,
        theme.us.primary,
        ...theme.us.etfs,
        ...theme.tags,
        ...theme.cn.map((item) => `${item.code} ${item.name}`),
      ]
        .join(" ")
        .toLowerCase();
      return signalOk && (!query || queryText.includes(query));
    })
    .sort((a, b) => getThemeScore(b) - getThemeScore(a));
}

function getSelectedTheme(themes = data.themes) {
  return themes.find((theme) => theme.id === state.selectedId) || themes[0] || data.themes[0];
}

function getAllCnEtfs(theme) {
  if (theme) return theme.cn;
  const byCode = new Map();
  data.themes.forEach((item) => {
    item.cn.forEach((etf) => {
      const prev = byCode.get(etf.code);
      if (!prev || etf.mappingScore > prev.mappingScore) {
        byCode.set(etf.code, etf);
      }
    });
  });
  return [...byCode.values()].sort((a, b) => b.mappingScore - a.mappingScore);
}

function renderSummary(themes) {
  const total = data.themes.length;
  const sync = data.themes.filter((theme) => theme.signal === "共振").length;
  const lead = data.themes.filter((theme) => theme.signal === "传导").length;
  const diverge = data.themes.filter((theme) => theme.signal === "背离").length;
  const strongest = [...data.themes].sort((a, b) => getThemeScore(b) - getThemeScore(a))[0];
  const cnCount = new Set(data.themes.flatMap((theme) => theme.cn.map((item) => item.code))).size;

  $("#summary-grid").innerHTML = [
    { label: "美股主题", value: total, unit: "个", note: "主题ETF池", icon: "trend" },
    { label: "A股ETF", value: cnCount, unit: "只", note: "场内候选标的", icon: "fund" },
    { label: "共振", value: sync, unit: "组", note: "两边同向，优先观察", icon: "sync" },
    { label: "传导", value: lead, unit: "组", note: "美股先动，观察跟随", icon: "lead" },
    { label: "背离", value: diverge, unit: "组", note: "不同步，二次确认", icon: "warn" },
    {
      label: "当前最强",
      value: strongest.name,
      unit: "",
      note: `${strongest.us.primary} · ${getThemeScore(strongest)}分`,
      icon: "chip",
      accent: true,
    },
  ]
    .map(
      (item) => `
        <article class="summary-card ${item.accent ? "summary-card-accent" : ""}">
          <i class="summary-icon ${item.icon}" aria-hidden="true"></i>
          <div>
            <span>${item.label}</span>
            <strong>${item.value}<small>${item.unit}</small></strong>
            <em>${item.note}</em>
          </div>
        </article>
      `,
    )
    .join("");

  $("#rank-caption").textContent = `按${horizonLabels[state.horizon]}排序 · ${themes.length} 个主题`;
}

function renderThemeList(themes) {
  const selected = getSelectedTheme(themes);
  if (selected.id !== state.selectedId) state.selectedId = selected.id;

  $("#theme-list").innerHTML = `
    <div class="theme-list-head" aria-hidden="true">
      <span>美股主题强弱</span>
      <span>主ETF</span>
      <span>强度</span>
      <span>涨跌幅</span>
    </div>
    ${themes
    .map((theme, index) => {
      const score = getThemeScore(theme);
      const active = theme.id === state.selectedId ? "active" : "";
      const periodReturn =
        state.horizon === "short"
          ? theme.us.returns["5d"]
          : state.horizon === "mid"
            ? theme.us.returns["20d"]
            : state.horizon === "long"
              ? theme.us.returns["120d"]
              : theme.us.returns.ytd;
      return `
        <button class="theme-row ${active}" data-theme-id="${theme.id}" type="button">
          <span class="rank">${String(index + 1).padStart(2, "0")}</span>
          <span class="theme-main">
            <strong>${theme.name}</strong>
            <small>${theme.us.primary} · ${theme.us.etfs.join(" / ")}</small>
          </span>
          <span class="theme-metrics">
            <b>${score}</b>
            <i class="mini-bar" style="--value:${score}%"></i>
          </span>
          <span class="theme-return ${periodReturn >= 0 ? "up" : "down"}">
            ${fmtPct(periodReturn)}
          </span>
          ${renderSignalPill(theme.signal)}
        </button>
      `;
    })
    .join("")}
  `;

  document.querySelectorAll(".theme-row").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedId = row.dataset.themeId;
      render();
    });
  });
}

function renderMetricStrip(theme) {
  const metrics = [
    ["1日", theme.us.returns["1d"]],
    ["5日", theme.us.returns["5d"]],
    ["20日", theme.us.returns["20d"]],
    ["60日", theme.us.returns["60d"]],
    ["120日", theme.us.returns["120d"]],
    ["年初至今", theme.us.returns.ytd],
  ];
  return `
    <div class="metric-strip">
      ${metrics
        .map(
          ([label, value]) => `
            <div class="metric-item">
              <i aria-hidden="true"></i>
              <span>${label}</span>
              <strong class="${value >= 0 ? "up" : "down"}">${fmtPct(value)}</strong>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderBars(theme) {
  const keys = [
    ["短期", "short"],
    ["中期", "mid"],
    ["长期", "long"],
    ["综合", "all"],
  ];
  return `
    <div class="score-bars">
      ${keys
        .map(
          ([label, key]) => `
            <div class="score-bar">
              <span>${label}</span>
              <div class="bar-track"><i style="width:${theme.us.strength[key]}%"></i></div>
              <b>${theme.us.strength[key]}</b>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderDetail(theme) {
  const bestCn = [...theme.cn].sort((a, b) => b.mappingScore - a.mappingScore)[0];
  $("#detail-view").innerHTML = `
    <div class="detail-header">
      <div>
        <h2>${theme.name}</h2>
        <p>${theme.lead}</p>
      </div>
      ${renderSignalPill(theme.signal)}
    </div>

    <div class="detail-layout">
      <div class="detail-main">
        <div class="us-card">
          <div>
            <p class="eyebrow">美股映射</p>
            <h3>${theme.us.primary}</h3>
            <span>${theme.us.etfs.join(" / ")}</span>
          </div>
          <div class="confidence">
            <span>置信度</span>
            <strong>${theme.confidence}</strong>
          </div>
        </div>

        ${renderMetricStrip(theme)}
        ${renderBars(theme)}

        <div class="signal-explain">
          <b>${theme.signal}说明</b>
          <span>${signalDescriptions[theme.signal]}</span>
        </div>

        <div class="tag-row" aria-label="主题标签">
          ${theme.tags.map((tag) => `<span>${tag}</span>`).join("")}
        </div>

        <div class="reason-grid">
          ${bestCn.reasons.map((reason) => `<div>${reason}</div>`).join("")}
        </div>
      </div>

      <aside class="detail-side">
        <div class="score-ring" style="--score:${getThemeScore(theme)}">
          <span>强度</span>
          <strong>${getThemeScore(theme)}</strong>
          <em>${horizonLabels[state.horizon]}</em>
        </div>
        <div class="mapping-focus">
          <p class="eyebrow">相关ETF</p>
          <h3>${bestCn.code}</h3>
          <strong>${bestCn.name}</strong>
          <span>${bestCn.index}</span>
          <div class="mapping-score">
            <span>映射分</span>
            <b>${bestCn.mappingScore}</b>
          </div>
        </div>
      </aside>
    </div>
  `;
}

function renderCnTable(theme) {
  const items = getAllCnEtfs(theme);
  $("#cn-etf-table").innerHTML = items
    .map(
      (item) => `
        <tr>
          <td><strong>${item.code}</strong></td>
          <td>
            <span class="name-cell">${item.name}</span>
            <small>${item.index}</small>
          </td>
          <td><span class="table-bar" style="--value:${item.mappingScore}%"><i></i><b>${item.mappingScore}</b></span></td>
          <td class="${item.returns["1d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["1d"])}</td>
          <td class="${item.returns["5d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["5d"])}</td>
          <td class="${item.returns["20d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["20d"])}</td>
          <td class="${item.returns["60d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["60d"])}</td>
          <td class="${item.returns["120d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["120d"])}</td>
          <td>${fmtAmount(item.amount)}</td>
          <td>${renderSignalPill(item.status)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderEmpty() {
  $("#theme-list").innerHTML = `<div class="empty-state">没有匹配主题，换个关键词试试。</div>`;
  $("#detail-view").innerHTML = `<div class="empty-state">暂无可展示映射。</div>`;
  $("#cn-etf-table").innerHTML = "";
}

function render() {
  const themes = getFilteredThemes();
  $("#update-time").textContent = `更新 ${data.updatedAt.replace("T", " ").slice(0, 16)}`;
  renderSummary(themes);

  if (!themes.length) {
    renderEmpty();
    return;
  }

  renderThemeList(themes);
  const selected = getSelectedTheme(themes);
  renderDetail(selected);
  renderCnTable(selected);
}

function bindEvents() {
  document.querySelectorAll("[data-horizon]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-horizon]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.horizon = button.dataset.horizon;
      render();
    });
  });

  document.querySelectorAll("[data-signal]").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll("[data-signal]").forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      state.signal = button.dataset.signal;
      render();
    });
  });

  $("#theme-search").addEventListener("input", (event) => {
    state.query = event.target.value;
    render();
  });

  $("#reset-view").addEventListener("click", () => {
    state.horizon = "short";
    state.signal = "all";
    state.query = "";
    state.selectedId = data.themes[0].id;
    $("#theme-search").value = "";
    document.querySelectorAll("[data-horizon]").forEach((item) => {
      item.classList.toggle("active", item.dataset.horizon === "short");
    });
    document.querySelectorAll("[data-signal]").forEach((item) => {
      item.classList.toggle("active", item.dataset.signal === "all");
    });
    render();
  });
}

async function loadLatestData() {
  try {
    const response = await fetch("./data/latest.json", { cache: "no-store" });
    if (!response.ok) return;
    const latest = await response.json();
    if (latest?.themes?.length) {
      data = latest;
      state.selectedId = latest.themes[0].id;
    }
  } catch {
    data = sampleData;
  }
}

bindEvents();
await loadLatestData();
render();
