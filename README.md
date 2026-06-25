# AI-ris

![数据快照](https://github.com/Zach0911/AI-ris/actions/workflows/update-snapshot.yml/badge.svg)

一页式投资看板，三个模块全部自动抓取、免 API key、单页静态部署到 GitHub Pages：

- **跨市雷达** — 美股主题 ETF 的短期 / 中期 / 长期强弱，映射到 A 股场内 ETF 候选池，给出共振 / 传导 / 背离信号。
- **人物雷达** — 追踪特朗普、黄仁勋、马斯克等公开发声后的上市公司市场信号。
- **美股三因子** — `^TNX` 10Y 国债收益率 + NVDA 数据中心营收增速 + SPX Trailing EPS 同比，自动给出 6 态市场判断与顶部预警。

线上 demo：<https://zach0911.github.io/AI-ris/>

---

## 快速开始

只需静态服务器（页面要 fetch `data/*.json`，直接双击 `index.html` 只能看到内置样例）：

```bash
python3 -m http.server 5173
# 访问 http://localhost:5173
```

依赖（仅刷新脚本需要，看页面不需要）：

```text
yfinance pandas requests   # 见 requirements.txt
```

---

## 数据刷新

三个独立脚本，各自产出一组快照与内置兜底数据：

| 脚本 | 输出 | 兜底 |
|------|------|------|
| `scripts/generate_snapshot.py` | `data/latest.json` + `src/data.js` | `--skip-cn` 可跳过 A 股 |
| `scripts/generate_people_snapshot.py` | `data/people-latest.json` + `src/peopleData.js` | — |
| `scripts/generate_factors_snapshot.py` | `data/factors-latest.json` + `src/factorsData.js` + `data/factors-history.json` | — |

```bash
python3 scripts/generate_snapshot.py            # 美股 ETF 强弱 + A 股候选 ETF
python3 scripts/generate_people_snapshot.py      # 人物雷达事件与行情
python3 scripts/generate_factors_snapshot.py     # 美股三因子（FRED + SEC EDGAR + multpl）
```

### 自动化

`.github/workflows/update-snapshot.yml` 每周一至周六自动跑两次（北京时间 08:00 美股收盘后 / 18:00 A 股收盘后），提交新快照并推送；push 到 `main` 改动触发文件时也会触发。**任一数据源失败时保留上一次快照**，页面不会因断网而空白。

### 数据来源

- **美股 ETF**：Nasdaq 历史日线收盘价；强弱分数用最新收盘价相对 EMA 的偏离计算，历史不足的标的使用可得日线初始化 EMA。
- **A 股 ETF**：优先本地 `finance-all-in-one` skill 的 `get_etf_kline`。
- **人物雷达**：事件事实来自人工核验的公开来源（来源 URL 可访问、公司为可交易上市主体、事件日期明确）；涨跌幅优先 `finance-all-in-one` 取美股日线，失败时降级到 Nasdaq 收盘价，实际行情源写入 `priceBasis.source`。人物照片优先加载 `assets/people/*.webp` 本地图，外链仅作失败兜底。
- **美股三因子**：见下节。

---

## 美股三因子

用一个分子、一个分母、一个集中度，直接给出市场状态判断。**三个因子全部自动抓取、免 API key、无需人工维护：**

| 因子 | 角色 | 来源 | 方向判定 |
|------|------|------|----------|
| `^TNX` 10Y 国债收益率 | 分母 · 定估值贴现率 | FRED DGS10 CSV 每日抓取 | 近 20 个交易日变动（±0.05pp 内记横盘）；**反向**——下行解压估值=利好，上行压制估值=利空 |
| NVDA 数据中心营收增速同比 | AI 景气 + 指数集中度 | SEC EDGAR 10-Q 每季解析 Data Center 行（原始数据中心口径） | 环比判断加速 / 减速 |
| SPX Trailing EPS（TTM）同比 | 分子 · 已实现盈利 | multpl.com 月度 EPS 表 | 最新值与约 12 个月前对比 |

> EPS 为**同步 / 滞后指标**：可靠的免 key 自动源里没有 Forward EPS，所以从 Forward 降级为 Trailing，信号会比预期滞后 1–2 季。

三因子方向组合映射到 6 态信号矩阵（主升牛市 / 扩散牛市 / 震荡偏强 / 主跌熊市 / 防御熊 / 震荡市），由规则函数 `pick_verdict` 完成判定，结论 banner 与矩阵高亮自动一致。两个顶部预警：① NVDA 减速 + EPS 转弱共振；② TNX 破 52 周高点且 EPS 未对冲。

### 看板能力

- 顶部三因子框架说明可展开（summary + 三因子角色 + 怎么读这张图）。
- 每张指标卡片 `?` 弹窗：释义 / 当前值含义 / 阈值参考 / 历史大图 + 数值表；卡片常显迷你 sparkline。
- 矩阵以**当前态主卡片**（彩色 chips + 白话理由 + 建议动作）+ 其余 5 态图例呈现。
- NVDA 历史回溯近 8 季 10-Q，解析结果缓存到 `data/factors-history.json`；**失败季度记为 `null` 不重复抓取**。

`data/factors_seed.json` 只保留 TNX 52 周区间、预警阈值、刻度标签等**纯参数**，不含任何需人工维护的数据值。

---

## 数据结构与口径

核心结构是 `themes[]`（跨市雷达）：

```json
{
  "id": "memory_chips",
  "name": "存储芯片",
  "signal": "传导",
  "confidence": 86,
  "tags": ["DRAM", "NAND", "存储", "半导体"],
  "us": {
    "primary": "DRAM",
    "etfs": ["DRAM", "SOXX", "SMH"],
    "returns": { "1d": 2.8, "5d": 7.6, "20d": 13.4, "60d": 24.8, "120d": 31.5, "ytd": 34.2 },
    "ema": { "ema5": 1.8, "ema20": 4.2, "ema60": 8.1, "ema120": 11.6, "emaYtd": 10.4 },
    "rel": { "5d": 4.1, "20d": 7.8, "60d": 12.4, "120d": 15.1 },
    "strength": { "short": 94, "mid": 91, "long": 88, "all": 92 }
  },
  "cn": [
    {
      "code": "512480",
      "name": "半导体ETF国联安",
      "mappingScore": 88,
      "status": "传导",
      "reasons": ["A股暂无纯存储主题场内基金，使用半导体宽主题替代映射"]
    }
  ]
}
```

美股主题强弱分数口径：

```text
EMA信号N = (最新收盘价 / EMA_N - 1) * 100
score(x) = clamp(round(50 + x * 3), 0, 99)

短期 = score(EMA5信号 * 0.4 + EMA20信号 * 0.6)
中期 = score(EMA20信号 * 0.55 + EMA60信号 * 0.45)
长期 = score(EMA120信号 * 0.6 + EMA年内信号 * 0.4)
综合 = round(短期 * 0.25 + 中期 * 0.35 + 长期 * 0.4)
```

数据契约详见 [references/data-contract.md](references/data-contract.md)。

---

## 测试

```bash
python3 scripts/e2e_smoke.py             # 端到端冒烟：文件校验 + 静态服务
python3 scripts/test_factors_mock.py      # 三因子分类 / 矩阵 / 容错逻辑（含真实 fixture 解析）
python3 tests/snapshot_score_test.py     # 快照分数口径
node --test tests/                        # 内容与人物雷达数据校验（Node）
```

三因子测试覆盖 6 态判定 + 2 个顶部预警 + NVDA 回填容错 + 断网保留旧快照；`test_factors_mock.py` 还含真实 fixture 解析路径（落实键名 bug 防护），fixture 需在联网机器上跑 `scripts/capture_factors_fixtures.py` 捕获后才会从 SKIP 转 PASS。

---

## 作为 Codex Skill 使用

仓库根目录含 `SKILL.md` 与 `agents/openai.yaml`，可作为 `AI-ris` skill 让 Codex 刷新快照、扩展主题映射、维护数据结构、验证看板或准备部署。

---

## 项目结构

```text
.
├── index.html                # 应用外壳与中文 UI
├── src/
│   ├── app.js                # 跨市雷达：筛选 / 排序 / 信号渲染
│   ├── factors.js            # 美股三因子：弹窗 / sparkline / 矩阵卡片
│   ├── data.js / factorsData.js / peopleData.js   # 内置兜底数据
│   └── styles.css
├── data/                     # 自动生成的快照 + seed 参数
│   ├── latest.json  people-latest.json  factors-latest.json
│   ├── factors-history.json (NVDA 8 季回填缓存)
│   └── factors_seed.json (纯参数，无人工数据值)
├── scripts/                  # 抓取 / 生成 / 测试脚本
├── tests/                    # 测试
├── references/data-contract.md
├── docs/design/person-radar-prd.md
├── .github/workflows/update-snapshot.yml
├── SKILL.md  agents/openai.yaml
└── requirements.txt
```

---

## 下一步增强

- 扩展到 30-50 个美股 ETF 与 80-150 个 A 股场内 ETF。
- 把主题标签与 ETF 基础信息拆成可维护的 `mapping_seed.json`。
- 增加历史相关性评分与成份股行业相似度评分。
