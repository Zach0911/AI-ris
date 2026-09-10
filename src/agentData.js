export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-10T23:20:33Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏弱且无趋势。价格 708.69 跌破 EMA20（-0.77%），仅勉强贴在 EMA60 上（+0.01%），EMA20 仍高于 EMA60 属金叉但价格已回落，动能转弱。ADX=9.7 远低于 20，说明市场处于无趋势的震荡状态，此时趋势跟踪策略最易被反复打脸。RSI=46.3 中性偏弱，MACD 柱为负（-0.589）动能向下，-DI(28.6) 高于 +DI(24.0) 空头略占优。近期一笔 short 已亏损、一笔 long 到期，样本不足无可靠胜率。综合看：无趋势 + 价格卡在均线夹缝 + 信号矛盾，不具备高胜率入场条件，应保持观望。\n\nHOLD。理由：ADX 仅 9.7 表明无趋势，价格夹在 EMA20 与 EMA60 之间，MACD 柱转负但 RSI 中性，多空信号矛盾且缺乏方向性动能，此时入场风险收益比差，选择空仓等待趋势明朗（如 ADX 回升过 20 且价格站稳 EMA20 上方或有效跌破 EMA60）。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-10",
    "indicators": {
      "price": 708.6900024414062,
      "date": "2026-09-10",
      "ema20": 714.2140822606301,
      "ema60": 708.6170872255834,
      "ma20": 716.5274993896485,
      "ma60": 712.779877726237,
      "ema20Pct": -0.7734487398706857,
      "ema60Pct": 0.010289790796358389,
      "emaCross": "golden",
      "rsi": 46.32113160623969,
      "atr": 9.007130585554334,
      "atrPct": 1.2709549386226926,
      "adx": 9.74411335031987,
      "plusDi": 23.984764427982977,
      "minusDi": 28.578650440437173,
      "macd": 0.7038115611308058,
      "macdSignal": 1.2927831740694165,
      "macdHist": -0.5889716129386107,
      "volume": 30814129.0,
      "volumeRatio": 1.0393336665276374
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏弱且无趋势。价格 708.69 跌破 EMA20（-0.77%），仅勉强贴在 EMA60 上（+0.01%），EMA20 仍高于 EMA60 属金叉但价格已回落，动能转弱。ADX=9.7 远低于 20，说明市场处于无趋势的震荡状态，此时趋势跟踪策略最易被反复打脸。RSI=46.3 中性偏弱，MACD 柱为负（-0.589）动能向下，-DI(28.6) 高于 +DI(24.0) 空头略占优。近期一笔 short 已亏损、一笔 long 到期，样本不足无可靠胜率。综合看：无趋势 + 价格卡在均线夹缝 + 信号矛盾，不具备高胜率入场条件，应保持观望。\n\nHOLD。理由：ADX 仅 9.7 表明无趋势，价格夹在 EMA20 与 EMA60 之间，MACD 柱转负但 RSI 中性，多空信号矛盾且缺乏方向性动能，此时入场风险收益比差，选择空仓等待趋势明朗（如 ADX 回升过 20 且价格站稳 EMA20 上方或有效跌破 EMA60）。",
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
