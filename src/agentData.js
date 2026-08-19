export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-08-19T21:51:00Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 让我分析当前指标快照。EMA20=714.88 在 EMA60=705.27 之上，形成 golden cross，价格在两条均线之上，这是偏多结构。但 ADX=14.6 非常低，说明市场没有明显趋势，处于震荡/盘整状态。RSI=51.5 中性，MACD柱为正但不大。+DI=23.7 略低于 -DI=28.7，说明空头动能略占优，这与 golden cross 的多头信号矛盾。量比1.05平淡。\n\n关键问题：ADX 只有 14.6，远低于 20，没有趋势可言。虽然均线是 golden cross，但价格相对 EMA20 仅 +0.17%，几乎贴着均线，缺乏方向性动能。MACD柱为正但绝对值小。整体是典型的无趋势震荡市。\n\n历史胜率样本不足，且最近两笔建议一 expired 一 loss，说明近期判断质量不佳，应降低信心度。\n\n在这种 ADX 极低、信号矛盾（均线多 vs DI 空）的震荡市里，趋势跟踪策略没有用武之地。最稳妥的做法是 HOLD，不强行下单。\n\n我判断不清晰，信号矛盾，输出 HOLD。\n\nHOLD\n\n当前市场处于典型的无趋势震荡状态：ADX 仅 14.6，远低于 20 的趋势阈值，均线虽呈 golden cross 但价格几乎贴着 EMA20（+0.17%），缺乏方向性动能。同时 +DI(23.7) 略低于 -DI(28.7)，空头动能微占优，与均线多头信号相互矛盾。MACD 柱虽为正但绝对值小，量比平淡，均不支持明确方向。历史胜率样本不足且最近两笔建议一 expired 一 loss，近期判断质量不佳，不宜强行下单。趋势跟踪策略在无趋势环境中没有优势，信号矛盾、信心不足，故选择 HOLD，等待 ADX 回升或方向信号明确后再行动。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-08-19",
    "indicators": {
      "price": 716.0800170898438,
      "date": "2026-08-19",
      "ema20": 714.8838490925252,
      "ema60": 705.2709320783407,
      "ma20": 706.7795013427734,
      "ma60": 716.055561319987,
      "ema20Pct": 0.16732340489113984,
      "ema60Pct": 1.532614562697221,
      "emaCross": "golden",
      "rsi": 51.46975720825872,
      "atr": 12.014843860472014,
      "atrPct": 1.6778633076929668,
      "adx": 14.55646375448948,
      "plusDi": 23.74015216294422,
      "minusDi": 28.65953495713662,
      "macd": 4.948200292241381,
      "macdSignal": 3.2857401011584964,
      "macdHist": 1.662460191082885,
      "volume": 34834540.0,
      "volumeRatio": 1.051293668119635
    },
    "trace": [
      {
        "thought": "Thought: 让我分析当前指标快照。EMA20=714.88 在 EMA60=705.27 之上，形成 golden cross，价格在两条均线之上，这是偏多结构。但 ADX=14.6 非常低，说明市场没有明显趋势，处于震荡/盘整状态。RSI=51.5 中性，MACD柱为正但不大。+DI=23.7 略低于 -DI=28.7，说明空头动能略占优，这与 golden cross 的多头信号矛盾。量比1.05平淡。\n\n关键问题：ADX 只有 14.6，远低于 20，没有趋势可言。虽然均线是 golden cross，但价格相对 EMA20 仅 +0.17%，几乎贴着均线，缺乏方向性动能。MACD柱为正但绝对值小。整体是典型的无趋势震荡市。\n\n历史胜率样本不足，且最近两笔建议一 expired 一 loss，说明近期判断质量不佳，应降低信心度。\n\n在这种 ADX 极低、信号矛盾（均线多 vs DI 空）的震荡市里，趋势跟踪策略没有用武之地。最稳妥的做法是 HOLD，不强行下单。\n\n我判断不清晰，信号矛盾，输出 HOLD。\n\nHOLD\n\n当前市场处于典型的无趋势震荡状态：ADX 仅 14.6，远低于 20 的趋势阈值，均线虽呈 golden cross 但价格几乎贴着 EMA20（+0.17%），缺乏方向性动能。同时 +DI(23.7) 略低于 -DI(28.7)，空头动能微占优，与均线多头信号相互矛盾。MACD 柱虽为正但绝对值小，量比平淡，均不支持明确方向。历史胜率样本不足且最近两笔建议一 expired 一 loss，近期判断质量不佳，不宜强行下单。趋势跟踪策略在无趋势环境中没有优势，信号矛盾、信心不足，故选择 HOLD，等待 ADX 回升或方向信号明确后再行动。",
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
