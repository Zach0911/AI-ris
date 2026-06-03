import { marketData as sampleData } from "./data.js";

let data = sampleData;

const state = {
  horizon: "short",
  signal: "all",
  query: "",
  pageTab: "radar",
  selectedId: data.themes[0].id,
  listCollapsed: false,
  detailCollapsed: false,
  sortKey: "strength",
  sortDir: "desc",
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

const strengthDescription =
  "强度是当前美股主题ETF在所选周期内的0-100分。计算时会参考主ETF涨跌幅、趋势延续、主题内ETF共振情况和相对排名，分数越高代表该主题越强。";

const selectedStrengthDescription =
  "这里展示的是当前选中美股主题的强度，不是A股ETF强度。它会随短期、中期、长期、综合周期切换而变化，用来判断美股主题本身的强弱。";

const sortLabels = {
  strength: "强度",
  "1d": "近1日涨跌幅",
  "5d": "近1周涨跌幅",
};

const $ = (selector) => document.querySelector(selector);

function fmtPct(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "-";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
}

function returnClass(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return "neutral";
  return value >= 0 ? "up" : "down";
}

function fmtAmount(value) {
  if (!value) return "-";
  return `${value.toFixed(1)}亿`;
}

function renderSignalPill(signal) {
  const description = signalDescriptions[signal] || "暂无信号说明。";
  return `<span class="signal-pill ${signalClass[signal]}" title="${description}" aria-label="${signal}：${description}">${signal}</span>`;
}

function renderHelp(label, description) {
  return `<span class="help-label">${label} <button class="help-dot" type="button" data-help="${description}" title="${description}" aria-label="${label}说明">?</button></span>`;
}

function getThemeScore(theme) {
  return theme.us.strength[state.horizon] ?? theme.us.strength.all;
}

function getThemeSortValue(theme) {
  if (state.sortKey === "1d") return theme.us.returns["1d"];
  if (state.sortKey === "5d") return theme.us.returns["5d"];
  return getThemeScore(theme);
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
    .sort((a, b) => {
      const direction = state.sortDir === "asc" ? 1 : -1;
      const diff = (getThemeSortValue(a) ?? 0) - (getThemeSortValue(b) ?? 0);
      if (diff !== 0) return diff * direction;
      return getThemeScore(b) - getThemeScore(a);
    });
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

  const sortText =
    state.sortKey === "strength"
      ? horizonLabels[state.horizon]
      : `${sortLabels[state.sortKey]}${state.sortDir === "desc" ? "从高到低" : "从低到高"}`;
  $("#rank-caption").textContent = `按${sortText}排序 · ${themes.length} 个主题`;
}

function renderSortButton(key, label) {
  const active = state.sortKey === key;
  const dirText = state.sortDir === "desc" ? "降序" : "升序";
  return `
    <button
      class="sort-head ${active ? "active" : ""}"
      data-sort-key="${key}"
      type="button"
      aria-label="按${label}${active ? dirText : "排序"}"
    >
      <span>${label}</span>
      <i aria-hidden="true">${active ? (state.sortDir === "desc" ? "↓" : "↑") : "↕"}</i>
    </button>
  `;
}

function renderThemeList(themes) {
  const selected = getSelectedTheme(themes);
  if (selected.id !== state.selectedId) state.selectedId = selected.id;

  $("#theme-list").innerHTML = `
    <div class="theme-list-head">
      <span aria-hidden="true"></span>
      <span>主题</span>
      <span>主ETF</span>
      <span>${renderHelp("强度", strengthDescription)}</span>
      <span>${renderSortButton("1d", "近1日")}</span>
      <span>${renderSortButton("5d", "近1周")}</span>
      <span>信号</span>
    </div>
    ${themes
    .map((theme, index) => {
      const score = getThemeScore(theme);
      const active = theme.id === state.selectedId ? "active" : "";
      const oneDayReturn = theme.us.returns["1d"];
      const oneWeekReturn = theme.us.returns["5d"];
      return `
        <button class="theme-row ${active}" data-theme-id="${theme.id}" type="button">
          <span class="rank">${String(index + 1).padStart(2, "0")}</span>
          <span class="theme-main">
            <strong>${theme.name}</strong>
            <small>${theme.us.etfs.join(" / ")}</small>
          </span>
          <span class="theme-primary">${theme.us.primary}</span>
          <span class="theme-metrics">
            <b>${score}</b>
            <i class="mini-bar" style="--value:${score}%"></i>
          </span>
          <span class="theme-return ${returnClass(oneDayReturn)}">
            ${fmtPct(oneDayReturn)}
          </span>
          <span class="theme-return ${returnClass(oneWeekReturn)}">
            ${fmtPct(oneWeekReturn)}
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

  document.querySelectorAll("[data-sort-key]").forEach((button) => {
    button.addEventListener("click", () => {
      const sortKey = button.dataset.sortKey;
      if (state.sortKey === sortKey) {
        state.sortDir = state.sortDir === "desc" ? "asc" : "desc";
      } else {
        state.sortKey = sortKey;
        state.sortDir = "desc";
      }
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
              <span class="metric-period">${label}</span>
              <strong class="${returnClass(value)}">${fmtPct(value)}</strong>
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
          ${bestCn.reasons.map((reason) => `<span>${reason}</span>`).join("")}
        </div>
      </div>

      <aside class="detail-side">
        <div class="score-ring" style="--score:${getThemeScore(theme)}">
          <span>${renderHelp("美股强度", selectedStrengthDescription)}</span>
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
          <td>
            <span class="name-cell">${item.name}</span>
            <small>${item.index}</small>
          </td>
          <td><strong>${item.code}</strong></td>
          <td><span class="table-bar" style="--value:${item.mappingScore}%"><i></i><b>${item.mappingScore}</b></span></td>
          <td class="${returnClass(item.returns["1d"])}">${fmtPct(item.returns["1d"])}</td>
          <td class="${returnClass(item.returns["5d"])}">${fmtPct(item.returns["5d"])}</td>
          <td class="${returnClass(item.returns["20d"])}">${fmtPct(item.returns["20d"])}</td>
          <td class="${returnClass(item.returns["60d"])}">${fmtPct(item.returns["60d"])}</td>
          <td class="${returnClass(item.returns["120d"])}">${fmtPct(item.returns["120d"])}</td>
          <td>${fmtAmount(item.amount)}</td>
          <td>${renderSignalPill(item.status)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderPageTabs() {
  document.querySelectorAll("[data-page-tab]").forEach((button) => {
    button.classList.toggle("active", button.dataset.pageTab === state.pageTab);
  });
  document.querySelectorAll("[data-page-panel]").forEach((panel) => {
    panel.classList.toggle("hidden", panel.dataset.pagePanel !== state.pageTab);
  });
}

function renderWorkspaceState() {
  const workspace = $(".workspace");
  if (!workspace) return;
  workspace.classList.toggle("list-collapsed", state.listCollapsed);
  workspace.classList.toggle("detail-collapsed", state.detailCollapsed);

  document.querySelectorAll("[data-collapse-panel='list']").forEach((button) => {
    const label = state.listCollapsed ? "显示榜单" : "隐藏榜单";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.dataset.tooltip = label;
  });

  document.querySelectorAll("[data-collapse-panel='detail']").forEach((button) => {
    const label = state.detailCollapsed ? "显示详情" : "隐藏详情";
    button.setAttribute("aria-label", label);
    button.setAttribute("title", label);
    button.dataset.tooltip = label;
  });
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
  renderPageTabs();
  renderWorkspaceState();

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
  document.querySelectorAll("[data-page-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      state.pageTab = button.dataset.pageTab;
      renderPageTabs();
    });
  });

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
    state.sortKey = "strength";
    state.sortDir = "desc";
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

  document.querySelectorAll("[data-collapse-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.collapsePanel;
      if (target === "list") {
        state.listCollapsed = !state.listCollapsed;
        if (state.listCollapsed && state.detailCollapsed) state.detailCollapsed = false;
      }
      if (target === "detail") {
        state.detailCollapsed = !state.detailCollapsed;
        if (state.detailCollapsed && state.listCollapsed) state.listCollapsed = false;
      }
      renderWorkspaceState();
    });
  });

  document.addEventListener("click", (event) => {
    const helpButton = event.target.closest(".help-dot");
    const existing = $(".help-popover");

    if (helpButton) {
      event.stopPropagation();
      if (existing && existing.dataset.owner === helpButton.dataset.help) {
        existing.remove();
        return;
      }
      existing?.remove();
      const popover = document.createElement("div");
      const rect = helpButton.getBoundingClientRect();
      popover.className = "help-popover";
      popover.dataset.owner = helpButton.dataset.help;
      popover.textContent = helpButton.dataset.help || helpButton.title || "暂无说明。";
      document.body.appendChild(popover);
      const left = Math.min(rect.left + window.scrollX, window.scrollX + window.innerWidth - popover.offsetWidth - 14);
      popover.style.left = `${Math.max(14, left)}px`;
      popover.style.top = `${rect.bottom + window.scrollY + 8}px`;
      return;
    }

    existing?.remove();
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
