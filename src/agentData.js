export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-22T23:42:57Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏多但存在追高风险。EMA20(718.48) 在 EMA60(710.84) 之上且为 golden 交叉，价格高于两线（+4.03%/+5.15%），MACD 柱为正 3.285，+DI 38.4 明显强于 -DI 21.1，方向偏多。但两个关键问题：一是 ADX 仅 12.2，远低于 20，说明当前并无有效趋势，属于震荡/盘整格局，趋势跟踪的顺势逻辑不成立；二是 RSI 68.2 已逼近 70 超买区，价格偏离 EMA20 达 4%，短线追多性价比低。量比 0.95 显示量能未放大，突破缺乏确认。历史胜率样本不足，且最近一条 short 已亏损、long 到期未兑现，说明当前环境对方向性下注不友好。综合看，方向偏多但趋势强度不足、位置偏高，属于「看多不做多」的时点，不宜新开仓。\n\n结论：HOLD，等待 ADX 回升至 20 以上或价格回踩 EMA20 附近再考虑顺势做多。\n\nHOLD（本轮不提交建议）。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-22",
    "indicators": {
      "price": 747.4600219726562,
      "date": "2026-09-22",
      "ema20": 718.4800078918287,
      "ema60": 710.8373949047833,
      "ma20": 716.0254577636719,
      "ma60": 711.8126363118489,
      "ema20Pct": 4.033517114256391,
      "ema60Pct": 5.1520400207389905,
      "emaCross": "golden",
      "rsi": 68.22501414945485,
      "atr": 10.017413042067298,
      "atrPct": 1.340193822758558,
      "adx": 12.161506790017985,
      "plusDi": 38.43250327374452,
      "minusDi": 21.087004829352267,
      "macd": 4.7304878441915434,
      "macdSignal": 1.4453384484484335,
      "macdHist": 3.28514939574311,
      "volume": 39451977.0,
      "volumeRatio": 0.9501025281445401
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏多但存在追高风险。EMA20(718.48) 在 EMA60(710.84) 之上且为 golden 交叉，价格高于两线（+4.03%/+5.15%），MACD 柱为正 3.285，+DI 38.4 明显强于 -DI 21.1，方向偏多。但两个关键问题：一是 ADX 仅 12.2，远低于 20，说明当前并无有效趋势，属于震荡/盘整格局，趋势跟踪的顺势逻辑不成立；二是 RSI 68.2 已逼近 70 超买区，价格偏离 EMA20 达 4%，短线追多性价比低。量比 0.95 显示量能未放大，突破缺乏确认。历史胜率样本不足，且最近一条 short 已亏损、long 到期未兑现，说明当前环境对方向性下注不友好。综合看，方向偏多但趋势强度不足、位置偏高，属于「看多不做多」的时点，不宜新开仓。\n\n结论：HOLD，等待 ADX 回升至 20 以上或价格回踩 EMA20 附近再考虑顺势做多。\n\nHOLD（本轮不提交建议）。",
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
