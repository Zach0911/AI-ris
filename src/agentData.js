export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-07-31T22:33:03Z",
    "mode": "live",
    "iterations": 2,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 复盘显示只有一条 open 建议（当前正在跟踪的 short swing），历史胜率样本不足，无法可靠校准。当前空头结构完整：ADX=27 有趋势，-DI(30.7) 大幅领先 +DI(17.5)，MACD 柱为负，价格低于双均线且死亡交叉。RSI=45.1 中性偏弱，未超卖，下行空间仍在。\n\n当前 open 建议 short swing 已持有 4/10 天，价格 687.99 略高于入场 682.12，处于小幅浮亏。但趋势结构未破坏，空头逻辑依然成立。我判断应继续维持空头方向，但考虑到价格已反弹至接近 EMA20 下方、且历史胜率样本不足，信心度不宜过高。\n\n我选择提交一条覆盖性的 short 建议，维持空头判断，信心度适中。",
    "action": "submit_suggestion(short, swing, conf=62)",
    "observation": "建议已提交：short swing 信心度 62",
    "asOfDate": "2026-07-31",
    "indicators": {
      "price": 687.989990234375,
      "date": "2026-07-31",
      "ema20": 696.4853658355937,
      "ema60": 696.6839331359623,
      "ma20": 701.0184967041016,
      "ma60": 713.3867340087891,
      "ema20Pct": -1.2197493325687536,
      "ema60Pct": -1.2479034592420613,
      "emaCross": "death",
      "rsi": 45.11856386963623,
      "atr": 15.30165091874512,
      "atrPct": 2.2241095271651212,
      "adx": 27.017591520778154,
      "plusDi": 17.524561873276042,
      "minusDi": 30.684378335503467,
      "macd": -9.93641436716814,
      "macdSignal": -7.375677995719119,
      "macdHist": -2.560736371449021,
      "volume": 50028419.0,
      "volumeRatio": 0.9330331317349875
    },
    "trace": [
      {
        "thought": "Thought: 当前指标快照显示，价格 687.99 低于 EMA20(696.49) 和 EMA60(696.68)，形成死亡交叉，价格相对两条均线均偏弱约 1.2%。ADX=27 表明存在趋势，且 -DI(30.7) 明显大于 +DI(17.5)，空头动能占优。RSI=45.1 处于中性偏弱区间，未超卖，仍有下行空间。MACD 柱为负且持续，量比 0.93 略缩量。整体结构偏空，与当前 open 的 short swing 建议方向一致。\n\n当前已有 open 建议 short swing，entry=682.12，已持有 4/10 天。当前价格 687.99 高于 entry，处于浮亏状态（价格高于入场价约 0.86%）。但趋势结构仍偏空，ADX 高且 -DI 占优，趋势尚未反转。让我复核一下近期表现来校准信心度。\n\n我判断当前空头趋势仍在延续，但价格已略高于入场点，处于浮亏。考虑到 ADX=27 有趋势、-DI 明显占优、MACD 柱为负，空头结构完整。不过价格反弹到 687.99 已接近 EMA20 下方，需警惕反弹压力。我倾向于维持空头判断，但会适当降低信心度，因为价格已高于入场点。\n\n让我复盘一下近期表现。",
        "action": "get_recent_suggestions({'limit': 5})",
        "observation": "- short swing conf65 → open（None）"
      },
      {
        "thought": "Thought: 复盘显示只有一条 open 建议（当前正在跟踪的 short swing），历史胜率样本不足，无法可靠校准。当前空头结构完整：ADX=27 有趋势，-DI(30.7) 大幅领先 +DI(17.5)，MACD 柱为负，价格低于双均线且死亡交叉。RSI=45.1 中性偏弱，未超卖，下行空间仍在。\n\n当前 open 建议 short swing 已持有 4/10 天，价格 687.99 略高于入场 682.12，处于小幅浮亏。但趋势结构未破坏，空头逻辑依然成立。我判断应继续维持空头方向，但考虑到价格已反弹至接近 EMA20 下方、且历史胜率样本不足，信心度不宜过高。\n\n我选择提交一条覆盖性的 short 建议，维持空头判断，信心度适中。",
        "action": "submit_suggestion(short, swing, conf=62)",
        "observation": "建议已提交：short swing 信心度 62"
      }
    ]
  },
  "currentSuggestion": {
    "id": "3e76a311631b",
    "ticker": "QQQ",
    "createdAt": "2026-07-27T22:34:03Z",
    "issuedAtClose": "2026-07-27",
    "direction": "short",
    "horizon": "swing",
    "entry": 682.12,
    "stop": 710.76,
    "target": 639.15,
    "sizePct": 25.0,
    "atr": 14.3217,
    "confidence": 65,
    "reasoning": "价格跌破EMA20/EMA60，RSI<40偏弱，-DI远大于+DI空头主导，MACD柱负值放大，ADX>20有弱趋势，放量下跌，短期空头结构明确，但趋势强度一般，按swing操作。",
    "thought": "Thought: 当前指标快照显示几个关键信号：价格已跌破EMA20和EMA60，且偏离幅度分别为-3.33%和-2.48%，说明空头动能较强。RSI=38.6已进入偏弱区域（<40），但尚未超卖（<30），仍有下行空间。ADX=22.3略高于20，表明有弱趋势形成，且-DI=35.9远大于+DI=14.9，空头主导。MACD柱为-3.687，负值且放大中，空头动能持续。EMA20与EMA60虽为金叉状态，但价格已跌破两条均线，金叉失效，结构转为空头排列倾向。量比1.13显示放量下跌。综合来看，短期空头趋势明确，但ADX仅22.3，趋势强度一般，适合swing周期。由于这是首次运行，暂无历史胜率参考，信心度不宜过高，但信号一致性较强，可以给出short建议。",
    "quality": "medium",
    "qualityFlags": [],
    "status": "open",
    "resolvedAt": null,
    "resolvedPrice": null,
    "resolution": null,
    "daysOpen": 4,
    "maxDays": 10
  },
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
  "history": [
    {
      "id": "3e76a311631b",
      "ticker": "QQQ",
      "createdAt": "2026-07-27T22:34:03Z",
      "issuedAtClose": "2026-07-27",
      "direction": "short",
      "horizon": "swing",
      "entry": 682.12,
      "stop": 710.76,
      "target": 639.15,
      "sizePct": 25.0,
      "atr": 14.3217,
      "confidence": 65,
      "reasoning": "价格跌破EMA20/EMA60，RSI<40偏弱，-DI远大于+DI空头主导，MACD柱负值放大，ADX>20有弱趋势，放量下跌，短期空头结构明确，但趋势强度一般，按swing操作。",
      "thought": "Thought: 当前指标快照显示几个关键信号：价格已跌破EMA20和EMA60，且偏离幅度分别为-3.33%和-2.48%，说明空头动能较强。RSI=38.6已进入偏弱区域（<40），但尚未超卖（<30），仍有下行空间。ADX=22.3略高于20，表明有弱趋势形成，且-DI=35.9远大于+DI=14.9，空头主导。MACD柱为-3.687，负值且放大中，空头动能持续。EMA20与EMA60虽为金叉状态，但价格已跌破两条均线，金叉失效，结构转为空头排列倾向。量比1.13显示放量下跌。综合来看，短期空头趋势明确，但ADX仅22.3，趋势强度一般，适合swing周期。由于这是首次运行，暂无历史胜率参考，信心度不宜过高，但信号一致性较强，可以给出short建议。",
      "quality": "medium",
      "qualityFlags": [],
      "status": "open",
      "resolvedAt": null,
      "resolvedPrice": null,
      "resolution": null,
      "daysOpen": 4,
      "maxDays": 10
    }
  ],
  "sourceNote": "AI 研判（DeepSeek live） | 数据 yfinance QQQ 日线 | 收盘价判定结局"
};
