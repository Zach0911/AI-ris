export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-08-21T21:49:57Z",
    "mode": "live",
    "iterations": 2,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 复盘显示最近两条建议均不理想：long swing 到期未达目标（expired），short swing 亏损。历史胜率样本不足，且近期判断偏弱。当前指标：ADX=14.4 极低，市场无趋势处于震荡；RSI=50.2 中性；MACD柱微弱负值；+DI< -DI 短期偏空；但均线 golden 且价格在 EMA60 上方，中期结构偏多。信号高度矛盾，且无趋势动能支撑。在这种低ADX震荡市里追单容易两头挨打，加上近期胜率不佳，我选择不强行出建议，输出 HOLD。\n\nHOLD\n\n当前市场处于典型的低波动震荡状态：ADX 仅 14.4，远低于 20 的趋势阈值，说明 QQQ 没有明确方向动能。虽然 EMA20 在 EMA60 上方呈 golden 交叉、价格也站在 EMA60 之上，中期结构偏多，但短期动能指标全面偏弱——RSI 50.2 中性、MACD 柱为负、+DI(22.2) 低于 -DI(28.6)、量比 0.93 缩量，多空信号互相抵消。\n\n结合近期复盘：最近两条建议一条到期未达目标、一条亏损，历史胜率样本不足且判断质量欠佳，此时强行下单风险较高。在无趋势、信号矛盾的震荡市里，最稳妥的做法是观望等待方向明朗，因此本轮不提交建议，维持 HOLD。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-08-21",
    "indicators": {
      "price": 713.4400024414062,
      "date": "2026-08-21",
      "ema20": 714.4056447772091,
      "ema60": 705.7196535482036,
      "ma20": 709.1885009765625,
      "ma60": 715.4929331461589,
      "ema20Pct": -0.1351672320707875,
      "ema60Pct": 1.093968242826504,
      "emaCross": "golden",
      "rsi": 50.167075853201474,
      "atr": 11.32323168810598,
      "atrPct": 1.5871315947182174,
      "adx": 14.364581128158562,
      "plusDi": 22.18301016860839,
      "minusDi": 28.616617715554543,
      "macd": 3.3830096131380287,
      "macdSignal": 3.4168803596319957,
      "macdHist": -0.03387074649396693,
      "volume": 33084596.0,
      "volumeRatio": 0.9307413316245781
    },
    "trace": [
      {
        "thought": "Thought: 让我分析当前指标快照。EMA20=714.41 在 EMA60=705.72 之上，交叉为 golden，价格在 EMA20 附近（-0.14%）且在 EMA60 之上（+1.09%），中期结构偏多。但 ADX=14.4 非常低，说明没有明显趋势，市场处于震荡/盘整状态。RSI=50.2 中性，MACD柱=-0.034 微弱负值，量比0.93偏低。+DI=22.2 低于 -DI=28.6，短期动能偏空。整体信号矛盾：均线结构偏多但动能指标偏弱、ADX极低无趋势。历史胜率样本不足，最近两条建议一expired一loss，判断需谨慎。这种低ADX、信号矛盾的震荡市，不适合追单，倾向HOLD。\n\n让我复盘一下最近建议以校准判断。",
        "action": "get_recent_suggestions({'limit': 5})",
        "observation": "- long swing conf62 → expired（2026-08-18）\n- short swing conf65 → loss（2026-08-04）"
      },
      {
        "thought": "Thought: 复盘显示最近两条建议均不理想：long swing 到期未达目标（expired），short swing 亏损。历史胜率样本不足，且近期判断偏弱。当前指标：ADX=14.4 极低，市场无趋势处于震荡；RSI=50.2 中性；MACD柱微弱负值；+DI< -DI 短期偏空；但均线 golden 且价格在 EMA60 上方，中期结构偏多。信号高度矛盾，且无趋势动能支撑。在这种低ADX震荡市里追单容易两头挨打，加上近期胜率不佳，我选择不强行出建议，输出 HOLD。\n\nHOLD\n\n当前市场处于典型的低波动震荡状态：ADX 仅 14.4，远低于 20 的趋势阈值，说明 QQQ 没有明确方向动能。虽然 EMA20 在 EMA60 上方呈 golden 交叉、价格也站在 EMA60 之上，中期结构偏多，但短期动能指标全面偏弱——RSI 50.2 中性、MACD 柱为负、+DI(22.2) 低于 -DI(28.6)、量比 0.93 缩量，多空信号互相抵消。\n\n结合近期复盘：最近两条建议一条到期未达目标、一条亏损，历史胜率样本不足且判断质量欠佳，此时强行下单风险较高。在无趋势、信号矛盾的震荡市里，最稳妥的做法是观望等待方向明朗，因此本轮不提交建议，维持 HOLD。",
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
