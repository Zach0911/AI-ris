export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-24T23:57:50Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏多：EMA20>EMA60 且 golden 交叉，价格站上两条均线（+2.56%/+3.97%），MACD 柱为正 3.557，+DI 33.8 明显高于 -DI 23.0，方向偏多。但两个关键瑕疵：ADX 仅 13.5，说明趋势强度很弱，属于震荡偏多而非成型趋势；RSI 63.4 已接近但未破 70，尚可顺势。量比 0.73 显示上攻缺乏量能配合。已有 open 的 long swing 建议（entry 741.21，已持有 1/10 天），方向与当前判断一致，无需反向覆盖。鉴于 ADX<20 趋势未确认、量能不足，且历史胜率样本不足无法校准，我倾向维持既有 long 跟踪，不新增建议，避免在弱趋势里重复下单。综合看信号偏多但强度不足，本轮 HOLD 观望，让已有仓位继续跟踪。\n\nHOLD：维持现有 long swing 建议跟踪，不新增操作。理由：EMA 多头排列、MACD 柱为正、+DI 占优支持偏多，但 ADX=13.5 显示趋势强度不足、量比 0.73 缺乏量能，RSI 63.4 偏热，属弱趋势震荡格局，不宜追多；已有同向 open 仓位在跟踪，重复下单无意义，故本轮观望。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-24",
    "indicators": {
      "price": 741.0999755859375,
      "date": "2026-09-24",
      "ema20": 722.5928858469517,
      "ema60": 712.7917207557592,
      "ma20": 719.1104736328125,
      "ma60": 712.201806640625,
      "ema20Pct": 2.561205638953057,
      "ema60Pct": 3.9714623509043534,
      "emaCross": "golden",
      "rsi": 63.40818903809306,
      "atr": 9.829533167364048,
      "atrPct": 1.3263437445929616,
      "adx": 13.487272808921983,
      "plusDi": 33.77223972996528,
      "minusDi": 22.96541578791293,
      "macd": 6.787385720815678,
      "macdSignal": 3.23074788005877,
      "macdHist": 3.556637840756908,
      "volume": 28622284.0,
      "volumeRatio": 0.7258931506434644
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏多：EMA20>EMA60 且 golden 交叉，价格站上两条均线（+2.56%/+3.97%），MACD 柱为正 3.557，+DI 33.8 明显高于 -DI 23.0，方向偏多。但两个关键瑕疵：ADX 仅 13.5，说明趋势强度很弱，属于震荡偏多而非成型趋势；RSI 63.4 已接近但未破 70，尚可顺势。量比 0.73 显示上攻缺乏量能配合。已有 open 的 long swing 建议（entry 741.21，已持有 1/10 天），方向与当前判断一致，无需反向覆盖。鉴于 ADX<20 趋势未确认、量能不足，且历史胜率样本不足无法校准，我倾向维持既有 long 跟踪，不新增建议，避免在弱趋势里重复下单。综合看信号偏多但强度不足，本轮 HOLD 观望，让已有仓位继续跟踪。\n\nHOLD：维持现有 long swing 建议跟踪，不新增操作。理由：EMA 多头排列、MACD 柱为正、+DI 占优支持偏多，但 ADX=13.5 显示趋势强度不足、量比 0.73 缺乏量能，RSI 63.4 偏热，属弱趋势震荡格局，不宜追多；已有同向 open 仓位在跟踪，重复下单无意义，故本轮观望。",
        "action": "HOLD（观望）",
        "observation": "Agent 未提交建议，选择观望"
      }
    ]
  },
  "currentSuggestion": {
    "id": "285d2149d484",
    "ticker": "QQQ",
    "createdAt": "2026-09-23T23:52:06Z",
    "issuedAtClose": "2026-09-23",
    "direction": "long",
    "horizon": "swing",
    "entry": 741.21,
    "stop": 721.27,
    "target": 771.12,
    "sizePct": 25.0,
    "atr": 9.9687,
    "confidence": 55,
    "reasoning": "EMA20>EMA60 金叉、MACD柱为正、+DI 压制 -DI，结构偏多；但 ADX 仅 13.1 趋势弱、RSI 63.5 偏热且价格偏离 EMA20 近 3%，故仅给中等偏低信心的顺势多单。",
    "thought": "Thought: 当前结构偏多：EMA20 在 EMA60 上方且为 golden 交叉，价格站上两条均线（+2.85% / +4.13%），MACD 柱为正 3.585，+DI 35.9 明显高于 -DI 21.6，方向偏多。但两个关键瑕疵：ADX 仅 13.1，说明趋势强度很弱、更像震荡而非成型趋势；RSI 63.5 已接近偏热区，且价格偏离 EMA20 近 3%，短线追多性价比不高。量比 0.80 显示上攻缺乏量能配合。历史样本不足且最近一笔 short 亏损，不宜高信心。综合看，方向偏多但趋势强度不足，属于弱趋势中的顺势回踩机会而非追高，我倾向给一个低信心的 swing 多单，等回踩 EMA20 附近更佳，但当前结构仍支持持有偏多。",
    "quality": "medium",
    "qualityFlags": [
      "choppy_adx_low"
    ],
    "status": "open",
    "resolvedAt": null,
    "resolvedPrice": null,
    "resolution": null,
    "daysOpen": 1,
    "maxDays": 10
  },
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
      "id": "285d2149d484",
      "ticker": "QQQ",
      "createdAt": "2026-09-23T23:52:06Z",
      "issuedAtClose": "2026-09-23",
      "direction": "long",
      "horizon": "swing",
      "entry": 741.21,
      "stop": 721.27,
      "target": 771.12,
      "sizePct": 25.0,
      "atr": 9.9687,
      "confidence": 55,
      "reasoning": "EMA20>EMA60 金叉、MACD柱为正、+DI 压制 -DI，结构偏多；但 ADX 仅 13.1 趋势弱、RSI 63.5 偏热且价格偏离 EMA20 近 3%，故仅给中等偏低信心的顺势多单。",
      "thought": "Thought: 当前结构偏多：EMA20 在 EMA60 上方且为 golden 交叉，价格站上两条均线（+2.85% / +4.13%），MACD 柱为正 3.585，+DI 35.9 明显高于 -DI 21.6，方向偏多。但两个关键瑕疵：ADX 仅 13.1，说明趋势强度很弱、更像震荡而非成型趋势；RSI 63.5 已接近偏热区，且价格偏离 EMA20 近 3%，短线追多性价比不高。量比 0.80 显示上攻缺乏量能配合。历史样本不足且最近一笔 short 亏损，不宜高信心。综合看，方向偏多但趋势强度不足，属于弱趋势中的顺势回踩机会而非追高，我倾向给一个低信心的 swing 多单，等回踩 EMA20 附近更佳，但当前结构仍支持持有偏多。",
      "quality": "medium",
      "qualityFlags": [
        "choppy_adx_low"
      ],
      "status": "open",
      "resolvedAt": null,
      "resolvedPrice": null,
      "resolution": null,
      "daysOpen": 1,
      "maxDays": 10
    },
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
