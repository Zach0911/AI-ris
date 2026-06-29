export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-06-29T14:40:24Z",
    "mode": "live",
    "iterations": 3,
    "error": null
  },
  "latestRun": {
    "thought": "EMA60斜率+2.22%，中期趋势仍向上。但EMA20斜率-1.7%，短期均线已拐头向下。\n\n综合判断：\n- **中期多头**：EMA60向上，价格在EMA60之上，EMA20>EMA60（黄金交叉结构仍在）\n- **短期空头**：价格跌破EMA20，EMA20斜率转负，MACD柱为负，-DI>+DI，RSI<50\n- **趋势强度不足**：ADX=21.3，刚过20但<25，不算强趋势，更适合swing操作\n\n信号矛盾，方向不清晰。中期看多但短期走弱，此时追空可能逆中期趋势，做多又面临短期压力。ADX不高说明没有明确趋势方向，RSI中性，MACD柱负但幅度不大。\n\n这种情况下，最合理的判断是**HOLD**——等待更清晰的信号出现（要么价格重新站上EMA20确认多头延续，要么跌破EMA60确认转空）。\n\n**结论：HOLD，不提交建议。**",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-06-26",
    "indicators": {
      "price": 706.52001953125,
      "date": "2026-06-26",
      "ema20": 718.7740549794606,
      "ema60": 691.1583221939521,
      "ma20": 724.1636749267578,
      "ma60": 685.9250356038411,
      "ema20Pct": -1.7048522221020934,
      "ema60Pct": 2.2226018039593454,
      "emaCross": "golden",
      "rsi": 46.653682413092874,
      "atr": 16.326733534260697,
      "atrPct": 2.3108663707919956,
      "adx": 21.266471559886234,
      "plusDi": 21.03939089876356,
      "minusDi": 28.891400048035127,
      "macd": 3.661343322333437,
      "macdSignal": 7.644169556781404,
      "macdHist": -3.982826234447967,
      "volume": 46937400.0,
      "volumeRatio": 0.9541727754183021
    },
    "trace": [
      {
        "thought": "Thought:让我先梳理一下当前的技术面情况：\n\n1. **趋势结构**：EMA20(718.77) > EMA60(691.16)，呈黄金交叉，价格(706.52)在EMA20下方但仍在EMA60上方。价格相对EMA20偏离-1.70%，相对EMA60偏离+2.22%——短期偏弱但中期仍偏多。\n\n2. **趋势强度**：ADX=21.3，刚刚突破20阈值，但不算强趋势（<25），+DI=21.0 < -DI=28.9，说明空头动能略占优。\n\n3. **动量**：RSI=46.7，处于中性偏弱区域（40-50），MACD柱=-3.983为负值，短期空头动量。\n\n4. **成交量**：量比0.95，略低于均值，无明显放量。\n\n整体来看：中期EMA60仍向上（价格高于EMA60），但短期价格跌破EMA20，ADX刚过20但不够强，MACD柱为负，RSI中性偏弱。信号有些矛盾——中期多头结构还在，但短期空头压力显现。ADX<25，更适合swing视角。\n\n我需要再看看EMA20和EMA60的斜率方向，以及更多细节来确认。\n\n先看几个关键指标。",
        "action": "get_indicator({'indicator': 'ema20Pct'})",
        "observation": "ema20Pct = -1.7048522221020934"
      },
      {
        "thought": "EMA20本身是负斜率（-1.7%），说明短期均线在走平或下弯。再确认一下EMA60的斜率。",
        "action": "get_indicator({'indicator': 'ema60Pct'})",
        "observation": "ema60Pct = 2.2226018039593454"
      },
      {
        "thought": "EMA60斜率+2.22%，中期趋势仍向上。但EMA20斜率-1.7%，短期均线已拐头向下。\n\n综合判断：\n- **中期多头**：EMA60向上，价格在EMA60之上，EMA20>EMA60（黄金交叉结构仍在）\n- **短期空头**：价格跌破EMA20，EMA20斜率转负，MACD柱为负，-DI>+DI，RSI<50\n- **趋势强度不足**：ADX=21.3，刚过20但<25，不算强趋势，更适合swing操作\n\n信号矛盾，方向不清晰。中期看多但短期走弱，此时追空可能逆中期趋势，做多又面临短期压力。ADX不高说明没有明确趋势方向，RSI中性，MACD柱负但幅度不大。\n\n这种情况下，最合理的判断是**HOLD**——等待更清晰的信号出现（要么价格重新站上EMA20确认多头延续，要么跌破EMA60确认转空）。\n\n**结论：HOLD，不提交建议。**",
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
