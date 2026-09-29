export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-09-29T01:09:10Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏多：EMA20>EMA60 金叉，价格在两条均线上方（+2.74%/+4.30%），MACD柱为正 3.54，+DI 34.6 明显高于 -DI 21.9，方向偏多。但两个问题让我谨慎：一是 ADX 仅 14.1，趋势强度很弱，属于无趋势/震荡区，趋势跟踪的胜率在这种环境下不高；二是 RSI 64.9 已接近超买边缘，价格偏离 EMA20 达 2.74%，短线有回踩风险。同时已有一条 open 的 long swing 建议在跟踪（entry 741.21，持有 2/10 天，现价 744.5 小幅浮盈），方向与当前判断一致，无需重复下单或反向覆盖。历史样本不足且最近一笔 short 亏损，缺乏校准依据，不宜加码信心。综合看，方向偏多但趋势强度不足、追高风险存在，维持现有持仓、本轮不新增操作最为稳妥。\n\nHOLD。理由：EMA 金叉且价格站上均线、MACD 柱为正，方向偏多，但 ADX=14.1 显示趋势强度不足（无趋势），RSI 64.9 偏高、价格偏离 EMA20 达 2.74%，追高风险较大；且已有一条同向 long swing 建议在跟踪（浮盈中），无需重复下单。维持现有持仓，等待 ADX 回升或回踩 EMA20 后再评估加仓。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-25",
    "indicators": {
      "price": 744.5,
      "date": "2026-09-25",
      "ema20": 724.679277685152,
      "ema60": 713.8325609687595,
      "ma20": 720.3175048828125,
      "ma60": 712.5365549723307,
      "ema20Pct": 2.735102675788048,
      "ema60Pct": 4.296167015640329,
      "emaCross": "golden",
      "rsi": 64.94080262487961,
      "atr": 9.577324681489497,
      "atrPct": 1.2864102997299525,
      "adx": 14.131100689013305,
      "plusDi": 34.617111937087145,
      "minusDi": 21.893617092524508,
      "macd": 7.655677564720236,
      "macdSignal": 4.115733721720819,
      "macdHist": 3.539943842999417,
      "volume": 30249200.0,
      "volumeRatio": 0.8435298572849165
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏多：EMA20>EMA60 金叉，价格在两条均线上方（+2.74%/+4.30%），MACD柱为正 3.54，+DI 34.6 明显高于 -DI 21.9，方向偏多。但两个问题让我谨慎：一是 ADX 仅 14.1，趋势强度很弱，属于无趋势/震荡区，趋势跟踪的胜率在这种环境下不高；二是 RSI 64.9 已接近超买边缘，价格偏离 EMA20 达 2.74%，短线有回踩风险。同时已有一条 open 的 long swing 建议在跟踪（entry 741.21，持有 2/10 天，现价 744.5 小幅浮盈），方向与当前判断一致，无需重复下单或反向覆盖。历史样本不足且最近一笔 short 亏损，缺乏校准依据，不宜加码信心。综合看，方向偏多但趋势强度不足、追高风险存在，维持现有持仓、本轮不新增操作最为稳妥。\n\nHOLD。理由：EMA 金叉且价格站上均线、MACD 柱为正，方向偏多，但 ADX=14.1 显示趋势强度不足（无趋势），RSI 64.9 偏高、价格偏离 EMA20 达 2.74%，追高风险较大；且已有一条同向 long swing 建议在跟踪（浮盈中），无需重复下单。维持现有持仓，等待 ADX 回升或回踩 EMA20 后再评估加仓。",
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
    "daysOpen": 2,
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
      "daysOpen": 2,
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
