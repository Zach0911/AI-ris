# 美股与A股ETF映射图谱

一页式 MVP 投资看板：用美股主题 ETF 的短期、中期、长期强弱，映射到 A 股场内 ETF 候选池。

## MVP 功能

- 美股主题 ETF 强弱榜：支持短期、中期、长期、综合维度排序。
- A 股场内 ETF 映射：每个主题展示候选 ETF、映射分数、成交额、近期涨跌幅。
- 主题传导状态：共振、传导、背离三类信号。
- 映射解释：展示标签命中、主题纯度、流动性或替代关系。
- 单页静态部署：用户无需注册，页面可直接部署到 GitHub Pages、Cloudflare Pages 或任意静态服务器。
- 数据刷新入口：`scripts/generate_snapshot.py` 可在早晚任务中生成 `data/latest.json`。

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

仓库根目录已包含 `SKILL.md` 和 `agents/openai.yaml`，可作为 `us-cn-etf-map` skill 使用。适合让 Codex 刷新快照、扩展主题映射、维护数据结构、验证静态看板或准备 GitHub Pages 部署。

基础校验：

```bash
python3 scripts/e2e_smoke.py
```

## 数据刷新

默认快照位于：

```text
data/latest.json
```

刷新脚本：

```bash
python3 scripts/generate_snapshot.py
```

脚本会尽量使用免费数据：

- 美股 ETF：优先 `yfinance`。
- A 股 ETF：优先本地 `/Users/zhangchao/.claude/skills/finance-all-in-one` 的 `get_etf_kline`。
- 任一数据源失败时保留现有快照结构，避免页面不可用。

可用于早晚两次定时：

- 北京时间 08:00：美股收盘后刷新美股强弱。
- 北京时间 18:00：A 股收盘后刷新 A 股候选 ETF 与共振状态。

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

## 下一步增强

- 扩展到 30-50 个美股 ETF 与 80-150 个 A 股场内 ETF。
- 把主题标签与 ETF 基础信息拆成可维护的 `mapping_seed.json`。
- 增加历史相关性评分与成份股行业相似度评分。
- 增加 GitHub Actions 定时任务，每天 08:00 和 18:00 自动提交新快照。
