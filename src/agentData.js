export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-07-01T22:47:11Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前指标呈现几个关键特征：EMA20 > EMA60 且为 golden cross，价格在两条均线上方，中期趋势偏多。但 ADX=18.1 < 20，表明市场处于无趋势/盘整状态，趋势跟踪信号可靠性较低。RSI=52.6 处于中性区间，MACD柱为负值（-1.471），显示短期动能偏弱。量比0.87偏低，交投不活跃。综合来看，均线结构偏多但缺乏趋势动能，信号矛盾，不适合积极入场。首次运行无历史胜率参考，更应谨慎。建议 HOLD，等待趋势确认。\n\nHOLD\n\n理由：EMA20/EMA60 golden cross 且价格在均线上方，中期结构偏多；但 ADX 仅 18.1（<20），市场无明确趋势，MACD 柱为负显示短期动能不足，RSI 中性，量能萎缩。多空信号矛盾，趋势跟踪条件不成熟，暂不参与。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-07-01",
    "indicators": {
      "price": 725.1699829101562,
      "date": "2026-07-01",
      "ema20": 721.3156419154901,
      "ema60": 694.7177792007885,
      "ma20": 722.2079223632812,
      "ma60": 693.0881958007812,
      "ema20Pct": 0.5343487331608054,
      "ema60Pct": 4.383392022066901,
      "emaCross": "golden",
      "rsi": 52.59741439480514,
      "atr": 16.019738692048765,
      "atrPct": 2.2091011858709964,
      "adx": 18.119552006670354,
      "plusDi": 26.03487735983206,
      "minusDi": 23.575364363533154,
      "macd": 4.607186650383596,
      "macdSignal": 6.0779657929739255,
      "macdHist": -1.4707791425903292,
      "volume": 38884823.0,
      "volumeRatio": 0.8730490509232195
    },
    "trace": [
      {
        "thought": "Thought: 当前指标呈现几个关键特征：EMA20 > EMA60 且为 golden cross，价格在两条均线上方，中期趋势偏多。但 ADX=18.1 < 20，表明市场处于无趋势/盘整状态，趋势跟踪信号可靠性较低。RSI=52.6 处于中性区间，MACD柱为负值（-1.471），显示短期动能偏弱。量比0.87偏低，交投不活跃。综合来看，均线结构偏多但缺乏趋势动能，信号矛盾，不适合积极入场。首次运行无历史胜率参考，更应谨慎。建议 HOLD，等待趋势确认。\n\nHOLD\n\n理由：EMA20/EMA60 golden cross 且价格在均线上方，中期结构偏多；但 ADX 仅 18.1（<20），市场无明确趋势，MACD 柱为负显示短期动能不足，RSI 中性，量能萎缩。多空信号矛盾，趋势跟踪条件不成熟，暂不参与。",
        "action": "HOLD（观望）",
        "observation": "Agent 未提交建议，选择观望"
      }
    ]
  },
  "currentSuggestion": null,
  "winRate": {
    "total": 0,
    "wins": 0,
    "losses": 0,
    "expired": 0,
    "decided": 0,
    "winRate": null,
    "recent10": {
      "winRate": null,
      "count": 0,
      "wins": 0
    },
    "byDirection": {},
    "byHorizon": {},
    "byConfidence": {
      "low": {
        "wins": 0,
        "losses": 0,
        "winRate": null
      },
      "mid": {
        "wins": 0,
        "losses": 0,
        "winRate": null
      },
      "high": {
        "wins": 0,
        "losses": 0,
        "winRate": null
      }
    }
  },
  "history": [],
  "sourceNote": "AI 研判（DeepSeek live） | 数据 yfinance QQQ 日线 | 收盘价判定结局"
};
