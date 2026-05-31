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
    { label: "覆盖主题", value: total, note: "美股主题ETF池" },
    { label: "A股ETF", value: cnCount, note: "场内候选标的" },
    { label: "共振", value: sync, note: "中美同步走强" },
    { label: "传导", value: lead, note: "美股领先观察" },
    { label: "背离", value: diverge, note: "需要确认" },
    { label: "当前最强", value: strongest.name, note: `${strongest.us.primary} · ${getThemeScore(strongest)}分` },
  ]
    .map(
      (item) => `
        <article class="summary-card">
          <span>${item.label}</span>
          <strong>${item.value}</strong>
          <em>${item.note}</em>
        </article>
      `,
    )
    .join("");

  $("#rank-caption").textContent = `按${horizonLabels[state.horizon]}排序 · ${themes.length} 个主题`;
}

function renderThemeList(themes) {
  const selected = getSelectedTheme(themes);
  if (selected.id !== state.selectedId) state.selectedId = selected.id;

  $("#theme-list").innerHTML = themes
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
            <small>${fmtPct(periodReturn)}</small>
          </span>
          <span class="signal-pill ${signalClass[theme.signal]}">${theme.signal}</span>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll(".theme-row").forEach((row) => {
    row.addEventListener("click", () => {
      state.selectedId = row.dataset.themeId;
      render();
    });
  });
}

function renderMetricStrip(theme) {
  const metrics = [
    ["1D", theme.us.returns["1d"]],
    ["5D", theme.us.returns["5d"]],
    ["20D", theme.us.returns["20d"]],
    ["60D", theme.us.returns["60d"]],
    ["120D", theme.us.returns["120d"]],
    ["YTD", theme.us.returns.ytd],
  ];
  return `
    <div class="metric-strip">
      ${metrics
        .map(
          ([label, value]) => `
            <div>
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
        <span class="signal-pill ${signalClass[theme.signal]}">${theme.signal}</span>
        <h2>${theme.name}</h2>
        <p>${theme.lead}</p>
      </div>
      <div class="confidence">
        <span>置信度</span>
        <strong>${theme.confidence}</strong>
      </div>
    </div>

    <div class="us-card">
      <div>
        <p class="eyebrow">美股主映射</p>
        <h3>${theme.us.primary}</h3>
        <span>${theme.us.etfs.join(" / ")}</span>
      </div>
      <div class="score-ring" style="--score:${getThemeScore(theme)}">
        <strong>${getThemeScore(theme)}</strong>
        <span>${horizonLabels[state.horizon]}</span>
      </div>
    </div>

    ${renderMetricStrip(theme)}
    ${renderBars(theme)}

    <div class="tag-row" aria-label="主题标签">
      ${theme.tags.map((tag) => `<span>${tag}</span>`).join("")}
    </div>

    <div class="mapping-focus">
      <div>
        <p class="eyebrow">A股首选候选</p>
        <h3>${bestCn.code} · ${bestCn.name}</h3>
        <p>${bestCn.index}</p>
      </div>
      <div class="mapping-score">
        <span>映射</span>
        <strong>${bestCn.mappingScore}</strong>
      </div>
    </div>

    <div class="reason-grid">
      ${bestCn.reasons.map((reason) => `<div>${reason}</div>`).join("")}
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
          <td><span class="score-badge">${item.mappingScore}</span></td>
          <td class="${item.returns["1d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["1d"])}</td>
          <td class="${item.returns["5d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["5d"])}</td>
          <td class="${item.returns["20d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["20d"])}</td>
          <td class="${item.returns["60d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["60d"])}</td>
          <td class="${item.returns["120d"] >= 0 ? "up" : "down"}">${fmtPct(item.returns["120d"])}</td>
          <td>${fmtAmount(item.amount)}</td>
          <td><span class="signal-pill ${signalClass[item.status]}">${item.status}</span></td>
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
