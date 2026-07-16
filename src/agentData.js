export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-07-16T22:29:14Z",
    "mode": "live",
    "iterations": 2,
    "error": null
  },
  "latestRun": {
    "thought": "EMA20的斜率为-1.65%，确认EMA20正在快速下行，短期均线已转头向下。虽然EMA60仍高于价格（+0.74%），但EMA20作为更敏感的均线已明显走弱，且价格在EMA20下方运行。综合判断：\n\n1. ADX=16.1 < 20 → 市场无趋势，处于震荡/盘整阶段，不适合趋势跟踪。\n2. 价格跌破EMA20，EMA20斜率向下，短期空头占优。\n3. RSI=45.6中性偏弱，MACD柱负值扩大，空头动能持续。\n4. 但EMA60仍在上方（700.74），长期结构尚未完全破坏。\n\n信号矛盾：短期偏空但长期结构仍偏多，且ADX极低表明无趋势。按原则，趋势不清晰时应HOLD，不强行出建议。\n\n结论：HOLD。当前ADX过低（16.1），市场处于无趋势震荡状态，短期偏空但长期EMA60仍提供支撑，信号矛盾，等待趋势明朗后再做决策。",
    "action": "submit_suggestion(flat, swing, conf=30)",
    "observation": "建议已提交：flat swing 信心度 30",
    "asOfDate": "2026-07-16",
    "indicators": {
      "price": 705.9400024414062,
      "date": "2026-07-16",
      "ema20": 717.7715234582821,
      "ema60": 700.7361329342142,
      "ma20": 719.6241973876953,
      "ma60": 708.6147776285808,
      "ema20Pct": -1.6483686842117429,
      "ema60Pct": 0.7426289672550102,
      "emaCross": "golden",
      "rsi": 45.64293894162478,
      "atr": 14.981417240066433,
      "atrPct": 2.1221941224827963,
      "adx": 16.089557443665672,
      "plusDi": 19.433184479175846,
      "minusDi": 29.344076201663906,
      "macd": -0.19872758881763275,
      "macdSignal": 1.6173961430491104,
      "macdHist": -1.8161237318667431,
      "volume": 35836836.0,
      "volumeRatio": 1.113769572903015
    },
    "trace": [
      {
        "thought": "Thought: 当前指标呈现几个关键信号：EMA20 > EMA60（黄金交叉），但价格已跌破EMA20（-1.65%），且EMA20本身在向下走？需要确认一下EMA20和EMA60的斜率方向。另外ADX仅16.1，远低于20阈值，说明市场无明显趋势，处于震荡/盘整状态。RSI=45.6处于中性偏弱区域，MACD柱为负且-1.816，空头动能持续。+DI=19.4 < -DI=29.3，短期空头占优。整体来看，虽然EMA长期结构仍偏多（EMA60>价格），但短期动能明显转弱，ADX低说明无趋势，不适合趋势跟踪策略。按原则，ADX<20时趋势不清晰，应保持观望。让我先快速复核一下EMA20和EMA60的斜率方向，确认结构是否在恶化。",
        "action": "get_indicator({'indicator': 'ema20Pct'})",
        "observation": "ema20Pct = -1.6483686842117429"
      },
      {
        "thought": "EMA20的斜率为-1.65%，确认EMA20正在快速下行，短期均线已转头向下。虽然EMA60仍高于价格（+0.74%），但EMA20作为更敏感的均线已明显走弱，且价格在EMA20下方运行。综合判断：\n\n1. ADX=16.1 < 20 → 市场无趋势，处于震荡/盘整阶段，不适合趋势跟踪。\n2. 价格跌破EMA20，EMA20斜率向下，短期空头占优。\n3. RSI=45.6中性偏弱，MACD柱负值扩大，空头动能持续。\n4. 但EMA60仍在上方（700.74），长期结构尚未完全破坏。\n\n信号矛盾：短期偏空但长期结构仍偏多，且ADX极低表明无趋势。按原则，趋势不清晰时应HOLD，不强行出建议。\n\n结论：HOLD。当前ADX过低（16.1），市场处于无趋势震荡状态，短期偏空但长期EMA60仍提供支撑，信号矛盾，等待趋势明朗后再做决策。",
        "action": "submit_suggestion(flat, swing, conf=30)",
        "observation": "建议已提交：flat swing 信心度 30"
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
