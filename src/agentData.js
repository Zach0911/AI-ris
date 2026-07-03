export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-07-03T22:33:40Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前指标呈现几个关键信号：EMA20 仍高于 EMA60（黄金交叉），但价格已跌破 EMA20（-1.09%），且 MACD 柱为负值（-2.12），显示短期动能偏弱。ADX=17.5 低于 20，说明市场无明显趋势，处于震荡格局。RSI=48.3 在中性区域，无超买超卖。+DI=23.4 低于 -DI=28.6，空头力量略占上风。整体来看，价格在 EMA20 下方、EMA60 上方，处于均线夹层，ADX 低表示无趋势，信号矛盾且不清晰。首次运行无历史胜率可参考，不宜冒进。建议 HOLD，等待趋势明朗或信号更一致时再行动。\n\nHOLD。理由：ADX 仅 17.5，市场无趋势，价格跌破 EMA20 但仍在 EMA60 之上，MACD 柱为负，多空信号混杂，缺乏明确方向，观望为宜。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-07-02",
    "indicators": {
      "price": 712.5999755859375,
      "date": "2026-07-02",
      "ema20": 720.4855784556017,
      "ema60": 695.3053338086225,
      "ma20": 720.6682678222656,
      "ma60": 695.1657969156901,
      "ema20Pct": -1.0944844845565682,
      "ema60Pct": 2.487344902502242,
      "emaCross": "golden",
      "rsi": 48.25485718631043,
      "atr": 16.537615886389926,
      "atrPct": 2.3207432575045797,
      "adx": 17.532594189028043,
      "plusDi": 23.41819293376383,
      "minusDi": 28.565713224302794,
      "macd": 3.428582414600669,
      "macdSignal": 5.548089089233166,
      "macdHist": -2.119506674632497,
      "volume": 51086100.0,
      "volumeRatio": 1.130060442608721
    },
    "trace": [
      {
        "thought": "Thought: 当前指标呈现几个关键信号：EMA20 仍高于 EMA60（黄金交叉），但价格已跌破 EMA20（-1.09%），且 MACD 柱为负值（-2.12），显示短期动能偏弱。ADX=17.5 低于 20，说明市场无明显趋势，处于震荡格局。RSI=48.3 在中性区域，无超买超卖。+DI=23.4 低于 -DI=28.6，空头力量略占上风。整体来看，价格在 EMA20 下方、EMA60 上方，处于均线夹层，ADX 低表示无趋势，信号矛盾且不清晰。首次运行无历史胜率可参考，不宜冒进。建议 HOLD，等待趋势明朗或信号更一致时再行动。\n\nHOLD。理由：ADX 仅 17.5，市场无趋势，价格跌破 EMA20 但仍在 EMA60 之上，MACD 柱为负，多空信号混杂，缺乏明确方向，观望为宜。",
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
