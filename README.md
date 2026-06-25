# AI-ris · 美股三因子 + ETF 映射 + 人物雷达看板

一页式投资看板，由三个模块组成：美股主题 ETF 的短期/中期/长期强弱映射到 A 股场内 ETF 候选池；人物公开发声后的市场信号追踪；美股三因子（TNX / NVDA / EPS）自动市场状态判断与顶部预警。三个模块的数据全部自动抓取，单页静态部署。

## MVP 功能

- 美股主题 ETF 强弱榜：支持短期、中期、长期、综合维度排序。
- A 股场内 ETF 映射：每个主题展示候选 ETF、映射分数、成交额、近期涨跌幅。
- 主题传导状态：共振、传导、背离三类信号。
- 映射解释：展示标签命中、主题纯度、流动性或替代关系。
- 人物雷达：追踪特朗普、黄仁勋、马斯克公开发声后的上市公司市场信号。
- 美股三因子：`^TNX` 10Y 国债收益率、NVDA 数据中心营收增速、SPX Trailing EPS 同比，全部自动抓取，给出 6 态市场判断与顶部预警。
- 单页静态部署：用户无需注册，页面可直接部署到 GitHub Pages、Cloudflare Pages 或任意静态服务器。
- 数据刷新入口：`scripts/generate_snapshot.py` 生成 `data/latest.json`，`scripts/generate_people_snapshot.py` 生成 `data/people-latest.json`，`scripts/generate_factors_snapshot.py` 生成 `data/factors-latest.json`。

## 本地预览

如果只是查看内置样例，直接打开 `index.html` 也可以。为了让页面读取 `data/latest.json`，推荐启动一个静态服务：

```bash
python3 -m http.server 5173
```

然后访问：

```text
http://localhost:5173
```

## 作为 Codex Skill 使用

仓库根目录已包含 `SKILL.md` 和 `agents/openai.yaml`，可作为 `AI-ris` skill 使用。适合让 Codex 刷新快照、扩展主题映射、维护数据结构、验证静态看板或准备 GitHub Pages 部署。

基础校验：

```bash
python3 scripts/e2e_smoke.py             # 端到端冒烟
python3 scripts/test_factors_mock.py      # 三因子分类 / 矩阵 / 容错逻辑
python3 tests/snapshot_score_test.py     # 快照分数口径
```

## 数据刷新

默认快照位于：

```text
data/latest.json
data/people-latest.json
data/factors-latest.json
```

刷新脚本：

```bash
python3 scripts/generate_snapshot.py
python3 scripts/generate_people_snapshot.py
python3 scripts/generate_factors_snapshot.py
```

脚本会尽量使用免费数据：

- 美股 ETF：使用 Nasdaq 历史日线收盘价，强弱分数使用最新收盘价相对 EMA 的偏离计算；历史不足的标的使用可得日线初始化 EMA。
- A 股 ETF：优先本地 `/Users/zhangchao/.claude/skills/finance-all-in-one` 的 `get_etf_kline`。
- 人物雷达：事件事实来自人工核验的公开来源；涨跌幅优先通过 `finance-all-in-one` 获取美股日线，失败时降级到 Nasdaq 历史日线收盘价，并把实际行情源写入 `priceBasis.source`。
- 人物照片：页面优先加载 `assets/people/*.webp` 本地静态图，外部真实照片链接只作为失败兜底，避免首屏受外链延时影响。
- 任一数据源失败时保留现有快照结构，避免页面不可用。

可用于早晚两次定时：

- 北京时间 08:00：美股收盘后刷新美股强弱。
- 北京时间 18:00：A 股收盘后刷新 A 股候选 ETF 与共振状态。

人物雷达不是直接抓社交媒体后自动入库。上线后推荐分两层更新：

- 事件池：新增人物发声先进入人工/半自动审核清单，必须满足「来源 URL 可访问、公司为可交易上市主体、事件日期明确」。
- 行情层：已入库事件每天早晚自动重算 `returnSinceMention`、`firstDayReturn` 和 `priceBasis`，页面只读取生成后的静态 JSON。

这样可以做到行情准实时刷新，同时避免把传闻、私有公司、OTC 无稳定行情的标的展示为可计算结果。

## 美股三因子

三因子看板用一个分子、一个分母、一个集中度，直接给出市场状态判断。**三个因子全部自动抓取、免 API key、无需人工维护：**

- `^TNX` 10 年期国债收益率（分母端 · 定估值贴现率）：每日从 FRED DGS10 CSV 自动抓取。脚本用近 20 个交易日的变动判断方向（±0.05pp 内记为横盘）。
- NVDA 数据中心营收增速同比（AI 景气 + 指数集中度）：每次 10-Q 披露后，脚本自动从 SEC EDGAR 解析最新季度的 Data Center 行（保持原始数据中心口径，非总收入代理），用环比判断加速/减速。
- SPX Trailing EPS（TTM）同比（分子端 · 已实现盈利）：从 multpl.com 月度 EPS 表自动抓取，取最新值与约 12 个月前对比计算同比。**为同步/滞后指标**——可靠的免 key 自动源里没有 Forward EPS，所以从 Forward 降级为 Trailing，信号会比预期滞后 1–2 季。

判定逻辑：三因子方向组合映射到 6 态信号矩阵（主升牛市 / 扩散牛市 / 震荡偏强 / 主跌熊市 / 防御熊 / 震荡市），由脚本里的规则函数 `pick_verdict` 完成，结论 banner 与矩阵高亮自动一致。同时维护两个顶部预警：① NVDA 减速 + EPS 转弱共振；② TNX 破 52 周高点且 EPS 未对冲。

刷新与数据：

```bash
python3 scripts/generate_factors_snapshot.py   # 抓 FRED + SEC EDGAR + multpl → 输出 data/factors-latest.json 与 src/factorsData.js
```

`data/factors_seed.json` 只保留 TNX 的 52 周区间、预警阈值和三因子刻度标签等**纯参数**，一般不用改；**不再包含任何需要人工维护的数据值**。任一数据源失败时脚本保留上一次快照，页面不会因断网而空白。

看板能力：顶部三因子框架说明可展开；每张指标卡片 `?` 弹窗展示释义、当前值含义、阈值参考、历史大图与数值表，卡片常显迷你 sparkline；矩阵以当前态主卡片 + 其余 5 态图例呈现，附白话理由与建议动作。NVDA 历史回溯近 8 季 10-Q，解析结果缓存到 `data/factors-history.json`，失败季度记为 `null` 不重复抓取。

## 数据结构

核心结构是 `themes[]`：

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

## 下一步增强

- 扩展到 30-50 个美股 ETF 与 80-150 个 A 股场内 ETF。
- 把主题标签与 ETF 基础信息拆成可维护的 `mapping_seed.json`。
- 增加历史相关性评分与成份股行业相似度评分。

> GitHub Actions 定时刷新已落地：`.github/workflows/update-snapshot.yml` 每周一至周六 北京时间 08:00 / 18:00 自动抓取并提交新快照。
