export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-07-17T22:22:07Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought:当前指标呈现几个关键信号：价格已跌破EMA20（-2.84%）和EMA60（-0.75%），EMA20虽仍在上方（golden交叉），但价格已回落到两条均线下方，这是弱势信号。RSI=42.1处于中性偏弱区域，MACD柱为负且持续下行，ADX=17.2低于20，说明市场没有明确趋势，处于震荡/无趋势状态。-DI（34.1）远高于+DI（17.7），空头动能占优。量比1.40显示放量下跌。综合来看，短期空头占优但无趋势确认，ADX偏低不适合做趋势跟踪，信号偏空但不够强烈。首次运行，谨慎起见，建议HOLD观望，等待趋势信号更明确再入场。\n\nHOLD。当前ADX仅17.2，市场无明确趋势；价格已跌破EMA20和EMA60，空头占优但未形成趋势结构；RSI 42.1未进入超卖区，MACD柱持续为负但未加速。信号偏空但缺乏趋势确认，不适合趋势跟踪系统入场，建议等待ADX回升至20以上或价格重新站上EMA20再考虑。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-07-17",
    "indicators": {
      "price": 695.3300170898438,
      "date": "2026-07-17",
      "ema20": 715.6342371374672,
      "ema60": 700.5587583470642,
      "ma20": 718.3048553466797,
      "ma60": 709.4765665690104,
      "ema20Pct": -2.837234301259839,
      "ema60Pct": -0.7463672668310384,
      "emaCross": "golden",
      "rsi": 42.06596887400175,
      "atr": 15.281315482678252,
      "atrPct": 2.1977068596340708,
      "adx": 17.205460387886266,
      "plusDi": 17.690961914677825,
      "minusDi": 34.12198569890827,
      "macd": -1.900480328970957,
      "macdSignal": 0.9138208516014856,
      "macdHist": -2.8143011805724427,
      "volume": 53690868.0,
      "volumeRatio": 1.4002346368290817
    },
    "trace": [
      {
        "thought": "Thought:当前指标呈现几个关键信号：价格已跌破EMA20（-2.84%）和EMA60（-0.75%），EMA20虽仍在上方（golden交叉），但价格已回落到两条均线下方，这是弱势信号。RSI=42.1处于中性偏弱区域，MACD柱为负且持续下行，ADX=17.2低于20，说明市场没有明确趋势，处于震荡/无趋势状态。-DI（34.1）远高于+DI（17.7），空头动能占优。量比1.40显示放量下跌。综合来看，短期空头占优但无趋势确认，ADX偏低不适合做趋势跟踪，信号偏空但不够强烈。首次运行，谨慎起见，建议HOLD观望，等待趋势信号更明确再入场。\n\nHOLD。当前ADX仅17.2，市场无明确趋势；价格已跌破EMA20和EMA60，空头占优但未形成趋势结构；RSI 42.1未进入超卖区，MACD柱持续为负但未加速。信号偏空但缺乏趋势确认，不适合趋势跟踪系统入场，建议等待ADX回升至20以上或价格重新站上EMA20再考虑。",
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
