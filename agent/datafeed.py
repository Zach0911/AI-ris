"""行情取数 —— Agent 的数据来源。

用 yfinance 拉美股日线 OHLCV，含 NY 收盘时区守卫：
只取已收盘的交易日，过滤盘中未完成的今日 bar。
"""
from __future__ import annotations

import datetime as dt

import pandas as pd
import pytz
import yfinance as yf

from . import indicators

NY = pytz.timezone("America/New_York")
DEFAULT_TICKER = "QQQ"
HISTORY_PERIOD = "1y"  # ~250 交易日，足够 EMA60/ADX 预热


def last_eligible_us_close_date(now: dt.datetime | None = None) -> dt.date:
    """返回最近一个「收盘已确定」的日期（NY 时区）。

    美股 16:00 ET 收盘。当前 NY 时间 < 16:00 则今日收盘未定，用昨日；
    再跳过周末。休市日不单独处理——yfinance 不会返回无数据的日期。
    """
    now = now or dt.datetime.now(NY)
    if now.tzinfo is None:
        now = NY.localize(now)
    cutoff = now.replace(hour=16, minute=0, second=0, microsecond=0)
    ref = now - dt.timedelta(days=1) if now < cutoff else now
    while ref.weekday() >= 5:  # 5=周六,6=周日
        ref -= dt.timedelta(days=1)
    return ref.date()


def _fetch_ohlcv(ticker: str, period: str = HISTORY_PERIOD) -> pd.DataFrame:
    df = yf.Ticker(ticker).history(period=period, interval="1d", auto_adjust=True)
    if df.empty:
        raise ValueError(f"yfinance returned empty for {ticker}")
    df.index = pd.to_datetime(df.index).tz_convert(NY)
    return df[["Open", "High", "Low", "Close", "Volume"]].dropna()


def fetch_close_prices(ticker: str = DEFAULT_TICKER, days: int = 120) -> list[dict]:
    """返回最近 days 个交易日的收盘价列表（升序），供 tracker 逐日判定建议结局。"""
    df = _fetch_ohlcv(ticker)
    eligible = last_eligible_us_close_date()
    df = df[df.index.normalize() <= pd.Timestamp(eligible, tz=NY)]
    closes = df["Close"].iloc[-days:]
    return [
        {"date": idx.strftime("%Y-%m-%d"), "close": float(val)}
        for idx, val in closes.items()
    ]


def get_market_snapshot(ticker: str = DEFAULT_TICKER, now: dt.datetime | None = None) -> dict:
    """取最近一个已收盘交易日的完整指标快照。"""
    eligible = last_eligible_us_close_date(now)
    df = _fetch_ohlcv(ticker)
    df = df[df.index.normalize() <= pd.Timestamp(eligible, tz=NY)]
    if len(df) < 30:
        raise ValueError(f"insufficient bars for {ticker}: {len(df)}")
    ind = indicators.compute_all(df)
    return {
        "ticker": ticker,
        "asOfDate": ind["date"],
        "eligibleCloseDate": eligible.isoformat(),
        "price": ind["price"],
        "indicators": ind,
    }
