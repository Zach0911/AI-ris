export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-17T23:36:46Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏震荡而非趋势。EMA20 在 EMA60 上方且呈 golden 交叉，价格站上双均线，这是偏多的基础；但 ADX 仅 10.4，远低于 20，说明几乎没有趋势动能，+DI 23.5 反而低于 -DI 27.8，方向偏空。RSI 53.1 中性，MACD 柱为负（-0.708），动能偏弱。整体是均线偏多、动能与 ADX 偏空/无趋势的矛盾组合，属于典型震荡市，趋势跟踪策略在此环境下胜率低。加上历史样本不足、最近一条 short 已亏损，没有可靠胜率支撑，不宜强行下单。ADX<25 也不满足 trend 周期条件。综合判断为信号矛盾、方向不清晰，本轮选择 HOLD 观望，等待 ADX 回升或 MACD 柱转正、DI 方向明朗后再介入。\n\nHOLD：均线偏多但 ADX 仅 10.4 无趋势、-DI 高于 +DI 且 MACD 柱为负，信号矛盾，暂不出建议。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-17",
    "indicators": {
      "price": 716.9199829101562,
      "date": "2026-09-17",
      "ema20": 712.5869057011845,
      "ema60": 708.8395113350224,
      "ma20": 712.7094940185547,
      "ma60": 711.2474985758464,
      "ema20Pct": 0.6080770182982809,
      "ema60Pct": 1.1399578389634568,
      "emaCross": "golden",
      "rsi": 53.05134250437128,
      "atr": 9.489127035474208,
      "atrPct": 1.323596393136579,
      "adx": 10.36555958843298,
      "plusDi": 23.47123726865848,
      "minusDi": 27.832385987861194,
      "macd": -0.5692210063365337,
      "macdSignal": 0.13849837481808552,
      "macdHist": -0.7077193811546192,
      "volume": 36358508.0,
      "volumeRatio": 1.1323370949146958
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏震荡而非趋势。EMA20 在 EMA60 上方且呈 golden 交叉，价格站上双均线，这是偏多的基础；但 ADX 仅 10.4，远低于 20，说明几乎没有趋势动能，+DI 23.5 反而低于 -DI 27.8，方向偏空。RSI 53.1 中性，MACD 柱为负（-0.708），动能偏弱。整体是均线偏多、动能与 ADX 偏空/无趋势的矛盾组合，属于典型震荡市，趋势跟踪策略在此环境下胜率低。加上历史样本不足、最近一条 short 已亏损，没有可靠胜率支撑，不宜强行下单。ADX<25 也不满足 trend 周期条件。综合判断为信号矛盾、方向不清晰，本轮选择 HOLD 观望，等待 ADX 回升或 MACD 柱转正、DI 方向明朗后再介入。\n\nHOLD：均线偏多但 ADX 仅 10.4 无趋势、-DI 高于 +DI 且 MACD 柱为负，信号矛盾，暂不出建议。",
        "action": "HOLD（观望）",
        "observation": "Agent 未提交建议，选择观望"
      }
    ]
  },
  "currentSuggestion": null,
  "winRate": {
    "total": 2,
    "wins": 0,
    "losses": 1,
    "expired": 1,
    "decided": 1,
    "winRate": null,
    "recent10": {
      "winRate": 0.0,
      "count": 2,
      "wins": 0
    },
    "byDirection": {
      "short": {
        "wins": 0,
        "losses": 1,
        "winRate": 0.0
      }
    },
    "byHorizon": {
      "swing": {
        "wins": 0,
        "losses": 1,
        "winRate": 0.0
      }
    },
    "byConfidence": {
      "low": {
        "wins": 0,
        "losses": 0,
        "winRate": null
      },
      "mid": {
        "wins": 0,
        "losses": 1,
        "winRate": 0.0
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
      "id": "8c57694b59ec",
      "ticker": "QQQ",
      "createdAt": "2026-08-04T22:36:01Z",
      "issuedAtClose": "2026-08-04",
      "direction": "long",
      "horizon": "swing",
      "entry": 723.85,
      "stop": 691.72,
      "target": 772.05,
      "sizePct": 25.0,
      "atr": 16.067,
      "confidence": 62,
      "reasoning": "多头结构明确（golden cross、价格站上双均线、RSI健康、MACD柱为正、+DI>−DI），上次逆势做空已亏损，顺势做多；但ADX未达25且价格偏离EMA20达3.5%，动能温和，故定swing并控制信心度。",
      "thought": "Thought: 复盘确认最近一次是short swing conf65→loss，说明我在多头结构下逆势做空失败。当前指标明确偏多：golden cross、价格在双均线上方、RSI=58.1健康、MACD柱为正、+DI>−DI。虽然ADX=24.9略低于25，趋势强度一般，但方向明确向上。上次逆势做空亏损的教训应让我顺势做多。\n\n不过价格已偏离EMA20达3.5%，短期有回踩风险，且ADX未达25，所以horizon定为swing而非trend，信心度适中（上次失败也提示我要谨慎）。我提交long建议。",
      "quality": "medium",
      "qualityFlags": [],
      "status": "expired",
      "resolvedAt": "2026-08-18",
      "resolvedPrice": 717.51,
      "resolution": "expired",
      "daysOpen": 10,
      "maxDays": 10
    },
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
      "status": "loss",
      "resolvedAt": "2026-08-04",
      "resolvedPrice": 723.85,
      "resolution": "loss",
      "daysOpen": 6,
      "maxDays": 10
    }
  ],
  "sourceNote": "AI 研判（DeepSeek live） | 数据 yfinance QQQ 日线 | 收盘价判定结局"
};
