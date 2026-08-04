export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-08-04T22:36:01Z",
    "mode": "live",
    "iterations": 2,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 复盘确认最近一次是short swing conf65→loss，说明我在多头结构下逆势做空失败。当前指标明确偏多：golden cross、价格在双均线上方、RSI=58.1健康、MACD柱为正、+DI>−DI。虽然ADX=24.9略低于25，趋势强度一般，但方向明确向上。上次逆势做空亏损的教训应让我顺势做多。\n\n不过价格已偏离EMA20达3.5%，短期有回踩风险，且ADX未达25，所以horizon定为swing而非trend，信心度适中（上次失败也提示我要谨慎）。我提交long建议。",
    "action": "submit_suggestion(long, swing, conf=62)",
    "observation": "建议已提交：long swing 信心度 62",
    "asOfDate": "2026-08-04",
    "indicators": {
      "price": 723.8499755859375,
      "date": "2026-08-04",
      "ema20": 699.4003998184921,
      "ema60": 697.6834022011776,
      "ma20": 700.6019958496094,
      "ma60": 713.9656778971354,
      "ema20Pct": 3.495790933747034,
      "ema60Pct": 3.7504938919579844,
      "emaCross": "golden",
      "rsi": 58.05877126279922,
      "atr": 16.066960369788372,
      "atrPct": 2.21965336902617,
      "adx": 24.934013930189067,
      "plusDi": 27.489596688647428,
      "minusDi": 25.19721431561047,
      "macd": -5.1453536272292695,
      "macdSignal": -7.088249934865763,
      "macdHist": 1.9428963076364933,
      "volume": 58988820.0,
      "volumeRatio": 1.059115900802287
    },
    "trace": [
      {
        "thought": "Thought: 让我分析当前指标快照。价格723.85高于EMA20(699.40)和EMA60(697.68)，EMA20在EMA60之上形成golden cross，这是多头结构。价格相对EMA20+3.50%、相对EMA60+3.75%，处于顺势但略偏离均线。RSI=58.1在40-70顺势区间，不极端。ADX=24.9接近25但略低于，+DI(27.5)>-DI(25.2)，多头略占优但趋势强度一般。MACD柱=1.943为正，动能偏多。量比1.06正常。\n\n整体看是偏多结构，但ADX未达25，趋势强度不足，且价格已偏离EMA20达3.5%，追高风险存在。最近一次建议是short swing conf65→loss，说明我此前逆势做空失败，应该吸取教训顺势而为。\n\n不过ADX=24.9接近25但未达，horizon应定为swing。价格偏离均线较多，短期可能有回踩需求。综合看，多头结构明确但动能温和，可以顺势做多但信心度不宜过高。考虑到最近一次做空亏损，这次应顺应趋势方向。\n\n我决定submit一个long建议，swing周期，信心度适中。让我先复盘一下最近表现。",
        "action": "get_recent_suggestions({'limit': 5})",
        "observation": "- short swing conf65 → loss（2026-08-04）"
      },
      {
        "thought": "Thought: 复盘确认最近一次是short swing conf65→loss，说明我在多头结构下逆势做空失败。当前指标明确偏多：golden cross、价格在双均线上方、RSI=58.1健康、MACD柱为正、+DI>−DI。虽然ADX=24.9略低于25，趋势强度一般，但方向明确向上。上次逆势做空亏损的教训应让我顺势做多。\n\n不过价格已偏离EMA20达3.5%，短期有回踩风险，且ADX未达25，所以horizon定为swing而非trend，信心度适中（上次失败也提示我要谨慎）。我提交long建议。",
        "action": "submit_suggestion(long, swing, conf=62)",
        "observation": "建议已提交：long swing 信心度 62"
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
    "daysOpen": 0,
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
      "daysOpen": 0,
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
