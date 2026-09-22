export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-22T00:18:47Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏多但趋势强度不足。EMA20(713.43) 在 EMA60(709.25) 上方且为 golden 交叉，价格站在两均线上方（+1.12%/+1.72%），中期结构仍偏多。但 ADX 仅 9.8，远低于 20，说明几乎无趋势动能；同时 -DI(26.4) 略高于 +DI(25.1)，方向性偏空，与均线结构矛盾。RSI 55.9 处于中性偏多区间，MACD 柱 0.068 微弱正值，量比 1.32 无异常。整体是「均线多头但动能缺失、DI 略偏空」的震荡格局，缺乏可跟踪的趋势。历史样本不足且最近一笔 short 亏损，不宜强行下单。按原则信号矛盾时选择 HOLD。\n\nHOLD：均线呈 golden 且价格在均线上方，但 ADX 仅 9.8 表明无趋势，+DI/-DI 几乎持平且 -DI 略占优，方向性矛盾；RSI 与 MACD 均处中性，无明确顺势入场点。等待 ADX 回升至 20 以上、DI 方向明朗后再介入，本轮空仓观望。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-18",
    "indicators": {
      "price": 721.4500122070312,
      "date": "2026-09-18",
      "ema20": 713.4310110827909,
      "ema60": 709.2547502003594,
      "ma20": 713.2354949951172,
      "ma60": 711.4279988606771,
      "ema20Pct": 1.1240051244856497,
      "ema60Pct": 1.719447349943981,
      "emaCross": "golden",
      "rsi": 55.869400903099475,
      "atr": 9.286321535005921,
      "atrPct": 1.2871746313507675,
      "adx": 9.805403916625526,
      "plusDi": 25.108889373543157,
      "minusDi": 26.408777603449206,
      "macd": 0.22381887494748298,
      "macdSignal": 0.15556243429526,
      "macdHist": 0.06825644065222297,
      "volume": 48277100.0,
      "volumeRatio": 1.3184261393956176
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏多但趋势强度不足。EMA20(713.43) 在 EMA60(709.25) 上方且为 golden 交叉，价格站在两均线上方（+1.12%/+1.72%），中期结构仍偏多。但 ADX 仅 9.8，远低于 20，说明几乎无趋势动能；同时 -DI(26.4) 略高于 +DI(25.1)，方向性偏空，与均线结构矛盾。RSI 55.9 处于中性偏多区间，MACD 柱 0.068 微弱正值，量比 1.32 无异常。整体是「均线多头但动能缺失、DI 略偏空」的震荡格局，缺乏可跟踪的趋势。历史样本不足且最近一笔 short 亏损，不宜强行下单。按原则信号矛盾时选择 HOLD。\n\nHOLD：均线呈 golden 且价格在均线上方，但 ADX 仅 9.8 表明无趋势，+DI/-DI 几乎持平且 -DI 略占优，方向性矛盾；RSI 与 MACD 均处中性，无明确顺势入场点。等待 ADX 回升至 20 以上、DI 方向明朗后再介入，本轮空仓观望。",
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
