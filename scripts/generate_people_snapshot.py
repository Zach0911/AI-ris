#!/usr/bin/env python3
"""Generate the people radar snapshot.

The front-end only displays events whose returns can be computed from daily
close data. `finance-all-in-one` is attempted first; when the current free US
route is unavailable or rate-limited, the script falls back to Nasdaq historical
daily closes and records the actual source on each row.
"""

from __future__ import annotations

import argparse
import json
import sys
import urllib.request
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
OUTFILE = ROOT / "data" / "people-latest.json"
FINANCE_SKILL = Path.home() / ".codex" / "skills" / "finance-all-in-one"
BJT = timezone(timedelta(hours=8))
NASDAQ_FROM_DATE = "2016-01-01"
NASDAQ_TO_DATE = "2026-06-03"


PEOPLE: list[dict[str, Any]] = [
    {
        "id": "trump",
        "name": "特朗普",
        "englishName": "Donald J. Trump",
        "title": "政策一句话，市场先定价",
        "subtitle": "追踪白宫、Truth Social 与政策表态中被直接点名或受政策预期影响的公司。",
        "image": {
            "src": "./assets/people/trump.webp",
            "fallbackSrc": "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg&w=900",
            "alt": "特朗普真实人物照片",
            "credit": "Wikimedia Commons / White House",
        },
    },
    {
        "id": "jensen_huang",
        "name": "黄仁勋",
        "englishName": "Jensen Huang",
        "title": "AI 教父点名，供应链重估",
        "subtitle": "追踪 GTC、Computex、采访与合作伙伴活动中的公司点名和 AI 供应链扩散。",
        "image": {
            "src": "./assets/people/jensen-huang.webp",
            "fallbackSrc": "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/0/04/Jensen_Huang_at_Computex_Taipei_20160531c.jpg&w=900",
            "alt": "黄仁勋真实人物照片",
            "credit": "Wikimedia Commons / NVIDIA Taiwan",
        },
    },
    {
        "id": "musk",
        "name": "马斯克",
        "englishName": "Elon Musk",
        "title": "产品、社媒与情绪行情",
        "subtitle": "追踪 X、Tesla、xAI、SpaceX 与加密资产相关公开发声中的市场情绪传导。",
        "image": {
            "src": "./assets/people/elon-musk.webp",
            "fallbackSrc": "https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/3/34/Elon_Musk_Royal_Society_%28crop2%29.jpg&w=900",
            "alt": "马斯克真实人物照片",
            "credit": "Wikimedia Commons",
        },
    },
]

PERSON_ORDER = {person["id"]: index for index, person in enumerate(PEOPLE)}

DISCLOSURE_SOURCES: list[dict[str, Any]] = [
    {
        "id": "open-cabinet-trump",
        "personId": "trump",
        "name": "Open Cabinet",
        "url": "https://open-cabinet.org/officials/trump-donald-j",
        "scope": "OGE 披露交易聚合",
        "coverage": "Trump 个人披露，含 5,000+ 笔证券交易记录",
        "cadence": "跟随 OGE 披露更新",
        "status": "待接入",
        "fields": ["交易日期", "披露日期", "资产名称", "买卖方向", "金额区间", "原始文件"],
    },
    {
        "id": "trump-trades-q1",
        "personId": "trump",
        "name": "TrumpTrades",
        "url": "https://trumpstrades.com/",
        "scope": "Trump Q1 交易可视化",
        "coverage": "Q1 2026 交易数据库，支持行业与标的排序",
        "cadence": "披露文件发布后更新",
        "status": "待接入",
        "fields": ["行业", "Top 标的", "交易金额区间", "交易日期", "政策事件"],
    },
    {
        "id": "trump-tracker",
        "personId": "trump",
        "name": "Trump Tracker",
        "url": "https://trumptracker.org/",
        "scope": "政府人物资产与交易",
        "coverage": "Trump 及政府人物财务披露、资产和交易浏览",
        "cadence": "站点更新",
        "status": "待接入",
        "fields": ["人物", "资产", "交易", "经济指标", "披露来源"],
    },
    {
        "id": "oge-official",
        "personId": "trump",
        "name": "OGE Official",
        "url": "https://www.oge.gov/web/oge.nsf/Officials%20Individual%20Disclosures%20Search%20Collection?OpenView",
        "scope": "官方原始披露",
        "coverage": "最权威原始 PDF 与披露文件，更新滞后且解析成本高",
        "cadence": "官方披露周期",
        "status": "原始源",
        "fields": ["OGE Form 278e", "Periodic Transaction Report", "PDF 页码", "签署日期"],
    },
    {
        "id": "propublica-disclosures",
        "personId": "trump",
        "name": "ProPublica",
        "url": "https://projects.propublica.org/trump-team-financial-disclosures/",
        "scope": "政府任命官员披露聚合",
        "coverage": "Trump 团队与 1,600+ 任命官员财务披露检索",
        "cadence": "披露项目更新",
        "status": "待接入",
        "fields": ["官员", "职位", "资产", "收入", "原始披露"],
    },
]

POLICY_LINKS: list[dict[str, Any]] = [
    {
        "id": "trump-tariff-us-made",
        "personId": "trump",
        "theme": "关税与美国制造",
        "tickers": ["AAPL", "GM", "TM", "F", "HOG"],
        "relation": "直接点名 + 政策预期",
        "evidence": "围绕关税、边境税、制造回流和抵制议题的公开发声。",
        "status": "已关联",
    },
    {
        "id": "trump-defense-cost",
        "personId": "trump",
        "theme": "政府采购与成本压力",
        "tickers": ["BA", "LMT"],
        "relation": "直接点名 + 合同成本",
        "evidence": "围绕 Air Force One 和 F-35 成本的公开批评。",
        "status": "已关联",
    },
    {
        "id": "jensen-ai-factory",
        "personId": "jensen_huang",
        "theme": "AI Factory 基础设施",
        "tickers": ["DELL", "HPE", "VRT", "CDNS", "HPQ"],
        "relation": "合作伙伴 + 生态扩散",
        "evidence": "NVIDIA 官方活动与博客中披露的 AI Factory、DGX 和数据中心基础设施合作。",
        "status": "已关联",
    },
    {
        "id": "jensen-chip-manufacturing",
        "personId": "jensen_huang",
        "theme": "AI 芯片制造链",
        "tickers": ["TSM", "AMKR", "ASML", "SNPS", "MRVL"],
        "relation": "供应链映射 + 技术合作",
        "evidence": "围绕 Blackwell 制造、先进封装、cuLitho 与 AI 加速芯片的公开合作线索。",
        "status": "已关联",
    },
    {
        "id": "musk-social-signal",
        "personId": "musk",
        "theme": "社交媒体触发的市场反应",
        "tickers": ["GME", "ETSY", "MANU", "META"],
        "relation": "直接点名 + 情绪传播",
        "evidence": "X / Twitter 发声对个股或品牌关注度的短期冲击。",
        "status": "已关联",
    },
    {
        "id": "musk-tesla-capital-market",
        "personId": "musk",
        "theme": "Tesla 资本市场事件",
        "tickers": ["TSLA"],
        "relation": "直接点名 + 监管披露",
        "evidence": "Funding secured 事件被 SEC 文件记录，属于高影响资本市场事件。",
        "status": "已关联",
    },
]


EVENT_SEED: list[dict[str, Any]] = [
    {
        "id": "trump-apple-tariff-2025-05-23",
        "personId": "trump",
        "company": "Apple",
        "ticker": "AAPL",
        "firstMentionedAt": "2025-05-23",
        "location": "Truth Social",
        "event": "iPhone 25% 关税表态",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2025/05/23/trump-tariff-apple-iphones-not-made-in-the-us.html",
        "confidence": "高",
        "notes": "特朗普称非美国制造 iPhone 可能面对 25% 关税。",
    },
    {
        "id": "trump-tesla-showroom-2025-03-11",
        "personId": "trump",
        "company": "Tesla",
        "ticker": "TSLA",
        "firstMentionedAt": "2025-03-11",
        "location": "白宫南草坪",
        "event": "公开支持并表示购买 Tesla",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2025/03/11/trump-turns-the-white-house-lawn-into-a-tesla-showroom.html",
        "confidence": "高",
        "notes": "特朗普在白宫展示 Tesla，并表示希望购买行为能帮助公司股票。",
    },
    {
        "id": "trump-boeing-air-force-one-2016-12-06",
        "personId": "trump",
        "company": "Boeing",
        "ticker": "BA",
        "firstMentionedAt": "2016-12-06",
        "location": "X / Twitter",
        "event": "Air Force One 成本批评",
        "eventType": "直接点名",
        "sourceName": "CBS News",
        "sourceUrl": "https://www.cbsnews.com/news/trigger-financial-app-alerts-companies-donald-trump-tweets/",
        "confidence": "高",
        "notes": "CBS 汇总记录特朗普推文点名 Boeing 并引发市场反应。",
    },
    {
        "id": "trump-lockheed-f35-2016-12-12",
        "personId": "trump",
        "company": "Lockheed Martin",
        "ticker": "LMT",
        "firstMentionedAt": "2016-12-12",
        "location": "X / Twitter",
        "event": "F-35 成本批评",
        "eventType": "直接点名",
        "sourceName": "CBS News",
        "sourceUrl": "https://www.cbsnews.com/news/trigger-financial-app-alerts-companies-donald-trump-tweets/",
        "confidence": "高",
        "notes": "CBS 汇总记录特朗普推文称 F-35 项目成本失控并引发 Lockheed Martin 市场反应。",
    },
    {
        "id": "trump-gm-border-tax-2017-01-03",
        "personId": "trump",
        "company": "General Motors",
        "ticker": "GM",
        "firstMentionedAt": "2017-01-03",
        "location": "X / Twitter",
        "event": "Chevy Cruze 边境税表态",
        "eventType": "直接点名",
        "sourceName": "CBS News",
        "sourceUrl": "https://www.cbsnews.com/news/trigger-financial-app-alerts-companies-donald-trump-tweets/",
        "confidence": "高",
        "notes": "CBS 汇总记录特朗普点名 GM 墨西哥生产与边境税议题。",
    },
    {
        "id": "trump-toyota-mexico-plant-2017-01-05",
        "personId": "trump",
        "company": "Toyota Motor",
        "ticker": "TM",
        "firstMentionedAt": "2017-01-05",
        "location": "X / Twitter",
        "event": "墨西哥工厂边境税表态",
        "eventType": "直接点名",
        "sourceName": "CBS News",
        "sourceUrl": "https://www.cbsnews.com/news/trigger-financial-app-alerts-companies-donald-trump-tweets/",
        "confidence": "高",
        "notes": "CBS 汇总记录特朗普点名 Toyota 墨西哥工厂与边境税议题。",
    },
    {
        "id": "trump-ford-us-jobs-2017-01-09",
        "personId": "trump",
        "company": "Ford Motor",
        "ticker": "F",
        "firstMentionedAt": "2017-01-09",
        "location": "X / Twitter",
        "event": "美国就业与建厂表态",
        "eventType": "直接点名",
        "sourceName": "CBS News",
        "sourceUrl": "https://www.cbsnews.com/news/trigger-financial-app-alerts-companies-donald-trump-tweets/",
        "confidence": "高",
        "notes": "CBS 汇总记录特朗普多次点名 Ford 与美国就业、墨西哥建厂议题。",
    },
    {
        "id": "trump-harley-boycott-2018-08-13",
        "personId": "trump",
        "company": "Harley-Davidson",
        "ticker": "HOG",
        "firstMentionedAt": "2018-08-13",
        "location": "X / Twitter",
        "event": "支持抵制 Harley-Davidson",
        "eventType": "直接点名",
        "sourceName": "Reuters",
        "sourceUrl": "https://www.reuters.com/article/business/trump-backs-boycott-of-harley-davidson-in-tweet-idUSKBN1KX0HF/",
        "confidence": "高",
        "notes": "Reuters 记录特朗普发帖支持抵制 Harley-Davidson。",
    },
    {
        "id": "jensen-marvell-computex-2026-06-02",
        "personId": "jensen_huang",
        "company": "Marvell Technology",
        "ticker": "MRVL",
        "firstMentionedAt": "2026-06-02",
        "location": "台北",
        "event": "Computex 采访",
        "eventType": "直接点名",
        "sourceName": "Axios",
        "sourceUrl": "https://www.axios.com/2026/06/03/marvell-jensen-huang-nvidia-ai",
        "confidence": "高",
        "notes": "黄仁勋在 Computex 期间点名 Marvell 的 AI 增长潜力。",
    },
    {
        "id": "jensen-dell-ai-factory-2024-05-20",
        "personId": "jensen_huang",
        "company": "Dell Technologies",
        "ticker": "DELL",
        "firstMentionedAt": "2024-05-20",
        "location": "Dell Technologies World",
        "event": "Dell AI Factory with NVIDIA",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Blog",
        "sourceUrl": "https://blogs.nvidia.com/blog/dell-technologies-world-2024/",
        "confidence": "高",
        "notes": "NVIDIA 官方博客记录黄仁勋与 Dell 推进 AI Factory。",
    },
    {
        "id": "jensen-hpe-private-cloud-ai-2024-06-18",
        "personId": "jensen_huang",
        "company": "Hewlett Packard Enterprise",
        "ticker": "HPE",
        "firstMentionedAt": "2024-06-18",
        "location": "HPE Discover",
        "event": "HPE-NVIDIA 私有云 AI 合作",
        "eventType": "合作伙伴",
        "sourceName": "CRN",
        "sourceUrl": "https://www.crn.com/news/ai/2024/nvidia-ceo-jensen-huang-hpe-nvidia-is-a-massive-partnership-exits-sphere-stage-with-a-go-hpe",
        "confidence": "中",
        "notes": "黄仁勋公开称 HPE-NVIDIA 是 massive partnership。",
    },
    {
        "id": "jensen-tsmc-us-ai-supercomputer-2025-04-14",
        "personId": "jensen_huang",
        "company": "Taiwan Semiconductor Manufacturing",
        "ticker": "TSM",
        "firstMentionedAt": "2025-04-14",
        "location": "NVIDIA Blog",
        "event": "美国 AI 超算制造链",
        "eventType": "供应链映射",
        "sourceName": "NVIDIA Blog",
        "sourceUrl": "https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 TSMC 将在美国制造 Blackwell 芯片。",
    },
    {
        "id": "jensen-amkor-us-ai-supercomputer-2025-04-14",
        "personId": "jensen_huang",
        "company": "Amkor Technology",
        "ticker": "AMKR",
        "firstMentionedAt": "2025-04-14",
        "location": "NVIDIA Blog",
        "event": "先进封装与测试合作",
        "eventType": "供应链映射",
        "sourceName": "NVIDIA Blog",
        "sourceUrl": "https://blogs.nvidia.com/blog/nvidia-manufacture-american-made-ai-supercomputers-us/",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 Amkor 参与美国 AI 超算制造链的先进封装与测试环节。",
    },
    {
        "id": "jensen-cadence-ai-factory-blueprint-2025-03-18",
        "personId": "jensen_huang",
        "company": "Cadence Design Systems",
        "ticker": "CDNS",
        "firstMentionedAt": "2025-03-18",
        "location": "GTC / NVIDIA Blog",
        "event": "AI Factory 数字孪生合作",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Blog",
        "sourceUrl": "https://blogs.nvidia.com/blog/omniverse-blueprint-ai-factory/",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 Cadence 参与 Omniverse Blueprint for AI factory digital twins。",
    },
    {
        "id": "jensen-vertiv-ai-factory-blueprint-2025-03-18",
        "personId": "jensen_huang",
        "company": "Vertiv",
        "ticker": "VRT",
        "firstMentionedAt": "2025-03-18",
        "location": "GTC / NVIDIA Blog",
        "event": "AI Factory 基础设施合作",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Blog",
        "sourceUrl": "https://blogs.nvidia.com/blog/omniverse-blueprint-ai-factory/",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 Vertiv 参与 AI factory digital twins 生态。",
    },
    {
        "id": "jensen-asml-culitho-2023-03-21",
        "personId": "jensen_huang",
        "company": "ASML",
        "ticker": "ASML",
        "firstMentionedAt": "2023-03-21",
        "location": "GTC / NVIDIA Newsroom",
        "event": "cuLitho 计算光刻合作",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Newsroom",
        "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-collaboration-with-asml-tsmc-and-synopsys-to-accelerate-next-generation-chip-manufacturing",
        "confidence": "高",
        "notes": "NVIDIA 官方记录与 ASML、TSMC、Synopsys 合作加速下一代芯片制造。",
    },
    {
        "id": "jensen-synopsys-culitho-2023-03-21",
        "personId": "jensen_huang",
        "company": "Synopsys",
        "ticker": "SNPS",
        "firstMentionedAt": "2023-03-21",
        "location": "GTC / NVIDIA Newsroom",
        "event": "cuLitho EDA 合作",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Newsroom",
        "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-collaboration-with-asml-tsmc-and-synopsys-to-accelerate-next-generation-chip-manufacturing",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 Synopsys 参与 cuLitho 计算光刻生态。",
    },
    {
        "id": "jensen-hpq-dgx-spark-2025-03-18",
        "personId": "jensen_huang",
        "company": "HP Inc.",
        "ticker": "HPQ",
        "firstMentionedAt": "2025-03-18",
        "location": "GTC / NVIDIA Newsroom",
        "event": "DGX Spark 个人 AI 电脑伙伴",
        "eventType": "合作伙伴",
        "sourceName": "NVIDIA Newsroom",
        "sourceUrl": "https://nvidianews.nvidia.com/news/nvidia-announces-dgx-spark-and-dgx-station-personal-ai-computers",
        "confidence": "高",
        "notes": "NVIDIA 官方记录 HP 是 DGX Spark 与 DGX Station 系统合作伙伴之一。",
    },
    {
        "id": "musk-gamestop-gamestonk-2021-01-26",
        "personId": "musk",
        "company": "GameStop",
        "ticker": "GME",
        "firstMentionedAt": "2021-01-26",
        "basisDateOverride": "2021-01-27",
        "location": "X / Twitter",
        "event": "Gamestonk 发帖",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2021/01/27/gamestop-jumps-another-50percent-even-as-hedge-funds-cover-short-bets-scrutiny-of-rally-intensifies.html",
        "confidence": "高",
        "notes": "马斯克发布 Gamestonk 相关帖，市场关注快速升温。",
    },
    {
        "id": "musk-etsy-2021-01-26",
        "personId": "musk",
        "company": "Etsy",
        "ticker": "ETSY",
        "firstMentionedAt": "2021-01-26",
        "location": "X / Twitter",
        "event": "公开称赞 Etsy",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2021/01/26/tesla-ceo-elon-musk-tweeted-on-tuesday-i-kinda-love-etsy.html",
        "confidence": "高",
        "notes": "马斯克发帖称赞 Etsy，并提到为宠物购买商品。",
    },
    {
        "id": "musk-tesla-funding-secured-2018-08-07",
        "personId": "musk",
        "company": "Tesla",
        "ticker": "TSLA",
        "firstMentionedAt": "2018-08-07",
        "location": "X / Twitter",
        "event": "Funding secured 发帖",
        "eventType": "直接点名",
        "sourceName": "SEC",
        "sourceUrl": "https://www.sec.gov/newsroom/press-releases/2018-219",
        "confidence": "高",
        "notes": "SEC 文件记录马斯克关于 Tesla 私有化的公开推文及其市场影响。",
    },
    {
        "id": "musk-manchester-united-2022-08-17",
        "personId": "musk",
        "company": "Manchester United",
        "ticker": "MANU",
        "firstMentionedAt": "2022-08-17",
        "location": "X / Twitter",
        "event": "玩笑称收购 Manchester United",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2022/08/17/manchester-united-shares-rise-after-elon-musk-jokes-about-buying-the-club.html",
        "confidence": "高",
        "notes": "CNBC 记录马斯克发帖玩笑称将收购 Manchester United 后股价上涨。",
    },
    {
        "id": "musk-meta-delete-facebook-2018-03-23",
        "personId": "musk",
        "company": "Meta Platforms",
        "ticker": "META",
        "firstMentionedAt": "2018-03-23",
        "location": "X / Twitter",
        "event": "删除 Tesla 与 SpaceX Facebook 页面",
        "eventType": "直接点名",
        "sourceName": "CNBC",
        "sourceUrl": "https://www.cnbc.com/2018/03/23/elon-musk-tweets-he-will-delete-tesla-and-spacex-facebook-accounts.html",
        "confidence": "高",
        "notes": "CNBC 记录马斯克发帖称将删除 Tesla 与 SpaceX 的 Facebook 页面。",
    },
]


def parse_date(value: str) -> datetime.date:
    return datetime.strptime(value, "%Y-%m-%d").date()


def calc_pct(current: float, base: float) -> float:
    return round((current / base - 1) * 100, 1)


def load_finance_rows(ticker: str) -> tuple[list[tuple[datetime.date, float]], str]:
    if str(FINANCE_SKILL) not in sys.path:
        sys.path.insert(0, str(FINANCE_SKILL))
    from core.fetcher import fetch_with_fallback  # type: ignore

    result = fetch_with_fallback(
        symbol=ticker,
        data_type="stock_kline",
        market="us",
        period="daily",
        start_date=NASDAQ_FROM_DATE,
        end_date=NASDAQ_TO_DATE,
        limit=9999,
    )
    rows = result.data.to_dict("records")
    parsed: list[tuple[datetime.date, float]] = []
    for row in rows:
        date_value = row.get("date") or row.get("日期") or row.get("datetime")
        close_value = row.get("close") or row.get("收盘") or row.get("收盘价")
        if not date_value or close_value in (None, ""):
            continue
        parsed.append((parse_date(str(date_value)[:10]), float(close_value)))
    parsed.sort()
    return parsed, f"finance-all-in-one:{getattr(result, 'source', 'unknown')}"


def load_nasdaq_rows(ticker: str) -> tuple[list[tuple[datetime.date, float]], str]:
    url = (
        f"https://api.nasdaq.com/api/quote/{ticker}/historical"
        f"?assetclass=stocks&fromdate={NASDAQ_FROM_DATE}&todate={NASDAQ_TO_DATE}&limit=9999"
    )
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/json",
            "Origin": "https://www.nasdaq.com",
            "Referer": "https://www.nasdaq.com/",
        },
    )
    with urllib.request.urlopen(request, timeout=20) as response:
        payload = json.loads(response.read().decode("utf-8"))
    rows = ((payload.get("data") or {}).get("tradesTable") or {}).get("rows") or []
    parsed: list[tuple[datetime.date, float]] = []
    for row in rows:
        try:
            close = float(str(row["close"]).replace("$", "").replace(",", ""))
            parsed.append((datetime.strptime(row["date"], "%m/%d/%Y").date(), close))
        except (KeyError, TypeError, ValueError):
            continue
    parsed.sort()
    return parsed, "nasdaq"


def load_price_rows(ticker: str, no_finance: bool) -> tuple[list[tuple[datetime.date, float]], str, str | None]:
    if not no_finance and FINANCE_SKILL.exists():
        try:
            rows, source = load_finance_rows(ticker)
            if rows:
                return rows, source, None
        except Exception as exc:
            finance_error = f"{type(exc).__name__}: {exc}"
        else:
            finance_error = "finance-all-in-one returned no rows"
    else:
        finance_error = "finance-all-in-one skipped or not installed"

    rows, source = load_nasdaq_rows(ticker)
    return rows, source, finance_error


def compute_event(seed: dict[str, Any], rows: list[tuple[datetime.date, float]], source: str) -> dict[str, Any]:
    basis_target = parse_date(seed.get("basisDateOverride") or seed["firstMentionedAt"])
    basis_idx = next((idx for idx, (row_date, _) in enumerate(rows) if row_date >= basis_target), None)
    if basis_idx is None or basis_idx == 0:
        raise ValueError(f"{seed['ticker']} has no computable basis date around {basis_target}")

    previous_date, previous_close = rows[basis_idx - 1]
    basis_date, basis_close = rows[basis_idx]
    latest_date, latest_close = rows[-1]
    event = {key: value for key, value in seed.items() if key != "basisDateOverride"}
    event["returnSinceMention"] = calc_pct(latest_close, basis_close)
    event["firstDayReturn"] = calc_pct(basis_close, previous_close)
    event["priceBasis"] = {
        "basisDate": basis_date.isoformat(),
        "basisClose": round(basis_close, 4),
        "previousDate": previous_date.isoformat(),
        "previousClose": round(previous_close, 4),
        "latestDate": latest_date.isoformat(),
        "latestClose": round(latest_close, 4),
        "source": source,
    }
    return event


def generate_snapshot(no_finance: bool) -> dict[str, Any]:
    by_ticker: dict[str, tuple[list[tuple[datetime.date, float]], str]] = {}
    finance_errors: dict[str, str] = {}
    events: list[dict[str, Any]] = []
    for seed in EVENT_SEED:
        ticker = seed["ticker"]
        if ticker not in by_ticker:
            rows, source, finance_error = load_price_rows(ticker, no_finance)
            if finance_error:
                finance_errors[ticker] = finance_error
            by_ticker[ticker] = (rows, source)
        rows, source = by_ticker[ticker]
        events.append(compute_event(seed, rows, source))
    events.sort(
        key=lambda event: (
            PERSON_ORDER[event["personId"]],
            event["firstMentionedAt"],
            event["ticker"],
        ),
        reverse=False,
    )
    events_by_person: list[dict[str, Any]] = []
    for person in PEOPLE:
        person_events = [event for event in events if event["personId"] == person["id"]]
        events_by_person.extend(sorted(person_events, key=lambda event: event["firstMentionedAt"], reverse=True))

    return {
        "updatedAt": datetime.now(BJT).strftime("%Y-%m-%dT%H:%M:%S+08:00"),
        "marketDataSource": "finance-all-in-one primary; Nasdaq historical daily close fallback",
        "financeFallbacks": finance_errors,
        "people": PEOPLE,
        "disclosureSources": DISCLOSURE_SOURCES,
        "policyLinks": POLICY_LINKS,
        "events": events_by_person,
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="生成人物雷达数据快照")
    parser.add_argument("--no-finance", action="store_true", help="跳过 finance-all-in-one，直接使用 Nasdaq 日线")
    args = parser.parse_args()
    snapshot = generate_snapshot(args.no_finance)
    OUTFILE.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"OK: {OUTFILE}")


if __name__ == "__main__":
    main()
