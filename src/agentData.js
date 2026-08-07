export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-08-07T22:06:18Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前处于 golden cross 状态，价格在 EMA20 和 EMA60 之上，RSI 57.2 处于健康区间（40-70），MACD 柱为正且较大（4.421），整体趋势偏多。但 ADX 只有 20.7，低于 25，说明趋势强度不足，属于震荡偏多而非强趋势。+DI(26.9) 略高于 -DI(25.4)，多头略占优但差距很小。当前已有 open 建议 long swing 在跟踪中（已持有 3/10 天），且入场价 723.85 与当前价 723.03 接近，尚未脱离成本区。量比 0.73 偏低，动能一般。\n\n考虑到已有 open long 建议在跟踪，且当前信号偏多但趋势强度不足（ADX<25），我倾向于维持多头判断但不过度加码。让我先复盘一下最近表现来校准信心度。\n\n由于样本不足且最近一次 short 是 loss，我保持谨慎。当前 open 建议是 long，信号仍支持多头方向，但 ADX 偏弱。我判断维持多头方向，但信心度保持中等偏低，因为趋势强度不足。\n\n我提交一条覆盖判断，维持 long 方向，信心度下调至 55，周期仍为 swing（ADX<25 非 trend）。",
    "action": "submit_suggestion(long, swing, conf=55)",
    "observation": "建议已提交：long swing 信心度 55",
    "asOfDate": "2026-08-07",
    "indicators": {
      "price": 723.030029296875,
      "date": "2026-08-07",
      "ema20": 704.3603432523365,
      "ema60": 699.6573477549153,
      "ma20": 700.3394958496094,
      "ma60": 714.3916819254557,
      "ema20Pct": 2.650587334081367,
      "ema60Pct": 3.3405897353838476,
      "emaCross": "golden",
      "rsi": 57.17725191046698,
      "atr": 14.939420481539845,
      "atrPct": 2.0662240676321537,
      "adx": 20.661223545211588,
      "plusDi": 26.922688823446688,
      "minusDi": 25.435157152608,
      "macd": 0.16685752478008453,
      "macdSignal": -4.254219667195806,
      "macdHist": 4.421077191975891,
      "volume": 29234924.0,
      "volumeRatio": 0.7288515427839037
    },
    "trace": [
      {
        "thought": "Thought: 当前处于 golden cross 状态，价格在 EMA20 和 EMA60 之上，RSI 57.2 处于健康区间（40-70），MACD 柱为正且较大（4.421），整体趋势偏多。但 ADX 只有 20.7，低于 25，说明趋势强度不足，属于震荡偏多而非强趋势。+DI(26.9) 略高于 -DI(25.4)，多头略占优但差距很小。当前已有 open 建议 long swing 在跟踪中（已持有 3/10 天），且入场价 723.85 与当前价 723.03 接近，尚未脱离成本区。量比 0.73 偏低，动能一般。\n\n考虑到已有 open long 建议在跟踪，且当前信号偏多但趋势强度不足（ADX<25），我倾向于维持多头判断但不过度加码。让我先复盘一下最近表现来校准信心度。\n\n由于样本不足且最近一次 short 是 loss，我保持谨慎。当前 open 建议是 long，信号仍支持多头方向，但 ADX 偏弱。我判断维持多头方向，但信心度保持中等偏低，因为趋势强度不足。\n\n我提交一条覆盖判断，维持 long 方向，信心度下调至 55，周期仍为 swing（ADX<25 非 trend）。",
        "action": "submit_suggestion(long, swing, conf=55)",
        "observation": "建议已提交：long swing 信心度 55"
      }
    ]
  },
  "currentSuggestion": {
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
    "status": "open",
    "resolvedAt": null,
    "resolvedPrice": null,
    "resolution": null,
    "daysOpen": 3,
    "maxDays": 10
  },
  "winRate": {
    "total": 1,
    "wins": 0,
    "losses": 1,
    "expired": 0,
    "decided": 1,
    "winRate": null,
    "recent10": {
      "winRate": 0.0,
      "count": 1,
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
      "status": "open",
      "resolvedAt": null,
      "resolvedPrice": null,
      "resolution": null,
      "daysOpen": 3,
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
