"""技术指标计算 —— 趋势研判 Agent 的「感知」传感器。

纯 pandas/numpy 实现，无外部依赖。compute_all(df) 一次算完所有指标，
返回当前快照（最新一行）供 LLM 研判与风控参数计算使用。
"""
from __future__ import annotations

import numpy as np
import pandas as pd


def calc_ema(series: pd.Series, span: int) -> pd.Series:
    return series.ewm(span=span, adjust=False).mean()


def calc_sma(series: pd.Series, window: int) -> pd.Series:
    return series.rolling(window=window, min_periods=1).mean()


def calc_rsi(close: pd.Series, period: int = 14) -> pd.Series:
    delta = close.diff()
    gain = delta.clip(lower=0.0)
    loss = -delta.clip(upper=0.0)
    avg_gain = gain.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()
    avg_loss = loss.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()
    rs = avg_gain / avg_loss.replace(0.0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50.0)


def calc_true_range(high: pd.Series, low: pd.Series, close: pd.Series) -> pd.Series:
    prev_close = close.shift(1)
    tr = pd.concat(
        [(high - low), (high - prev_close).abs(), (low - prev_close).abs()],
        axis=1,
    ).max(axis=1)
    return tr


def calc_atr(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14) -> pd.Series:
    tr = calc_true_range(high, low, close)
    return tr.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()


def calc_dmi(high: pd.Series, low: pd.Series, close: pd.Series, period: int = 14):
    up = high.diff()
    down = -low.diff()
    plus_dm = np.where((up > down) & (up > 0), up, 0.0)
    minus_dm = np.where((down > up) & (down > 0), down, 0.0)
    plus_dm = pd.Series(plus_dm, index=high.index)
    minus_dm = pd.Series(minus_dm, index=high.index)
    atr = calc_atr(high, low, close, period)
    atr_safe = atr.replace(0.0, np.nan)
    plus_di = 100 * plus_dm.ewm(alpha=1 / period, adjust=False, min_periods=period).mean() / atr_safe
    minus_di = 100 * minus_dm.ewm(alpha=1 / period, adjust=False, min_periods=period).mean() / atr_safe
    dx = 100 * (plus_di - minus_di).abs() / (plus_di + minus_di).replace(0.0, np.nan)
    adx = dx.ewm(alpha=1 / period, adjust=False, min_periods=period).mean()
    return adx, plus_di, minus_di


def calc_macd(close: pd.Series, fast: int = 12, slow: int = 26, signal: int = 9):
    macd_line = calc_ema(close, fast) - calc_ema(close, slow)
    signal_line = calc_ema(macd_line, signal)
    hist = macd_line - signal_line
    return macd_line, signal_line, hist


def calc_volume_ratio(volume: pd.Series, window: int = 5) -> pd.Series:
    ma = volume.rolling(window=window, min_periods=1).mean()
    return volume / ma.replace(0.0, np.nan)


def _safe_last(series: pd.Series, default=0.0) -> float:
    val = series.iloc[-1]
    if pd.isna(val):
        return default
    return float(val)


def compute_all(df: pd.DataFrame) -> dict:
    """对 OHLCV DataFrame 一次算完所有指标，返回最新快照字典。

    df 需含列 Open/High/Low/Close/Volume，时间索引升序。
    """
    df = df.copy()
    close = df["Close"].astype(float)
    high = df["High"].astype(float)
    low = df["Low"].astype(float)
    volume = df["Volume"].astype(float)
    last = float(close.iloc[-1])

    ema20 = calc_ema(close, 20)
    ema60 = calc_ema(close, 60)
    ma20 = calc_sma(close, 20)
    ma60 = calc_sma(close, 60)
    rsi = calc_rsi(close, 14)
    atr = calc_atr(high, low, close, 14)
    adx, plus_di, minus_di = calc_dmi(high, low, close, 14)
    macd_line, macd_signal, macd_hist = calc_macd(close)
    vol_ratio = calc_volume_ratio(volume, 5)

    ema20_last = _safe_last(ema20, last)
    ema60_last = _safe_last(ema60, last)
    ema_cross = "golden" if ema20_last > ema60_last else "death"

    return {
        "price": last,
        "date": df.index[-1].strftime("%Y-%m-%d"),
        "ema20": ema20_last,
        "ema60": ema60_last,
        "ma20": _safe_last(ma20, last),
        "ma60": _safe_last(ma60, last),
        "ema20Pct": (last / ema20_last - 1) * 100 if ema20_last else 0.0,
        "ema60Pct": (last / ema60_last - 1) * 100 if ema60_last else 0.0,
        "emaCross": ema_cross,
        "rsi": _safe_last(rsi, 50.0),
        "atr": _safe_last(atr),
        "atrPct": (_safe_last(atr) / last * 100) if last else 0.0,
        "adx": _safe_last(adx),
        "plusDi": _safe_last(plus_di),
        "minusDi": _safe_last(minus_di),
        "macd": _safe_last(macd_line),
        "macdSignal": _safe_last(macd_signal),
        "macdHist": _safe_last(macd_hist),
        "volume": _safe_last(volume),
        "volumeRatio": _safe_last(vol_ratio, 1.0),
    }
