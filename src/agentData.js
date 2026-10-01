export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-10-01T00:41:44Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏多：EMA20 在 EMA60 上方（golden），价格站在两条均线上方，MACD 柱为正 2.23，RSI 59.5 处于顺势不极端的健康区间。但 ADX 仅 13.6，说明趋势强度很弱，+DI 30.1 与 -DI 24.7 差距不大，属于震荡偏多的格局，而非强趋势。量比 0.84 显示上攻动能不足。已有一条 long swing 建议在跟踪（entry 741.21，现价 737.93 略低于入场，持有 4/10 天），方向与当前结构一致，无需反向覆盖。考虑到 ADX<20 无明确趋势、且历史样本不足无法校准信心，我倾向维持多头跟踪但不加码，信心度中等偏低。\n\n由于已有 open long 建议且方向一致，本轮不重复下单，维持持有判断。\n\nHOLD：维持现有 long swing 建议跟踪。理由——EMA 多头排列、MACD 柱为正、RSI 健康支撑偏多结构，但 ADX 13.6 表明趋势强度不足、量能偏弱，属震荡偏多而非强趋势，不宜追高加仓；现价略低于入场价，继续持有等待趋势确认，若跌破止损 721.27 则离场。",
    "action": "HOLD（观望）",
    "observation": "Agent 未提交建议，选择观望",
    "asOfDate": "2026-09-29",
    "indicators": {
      "price": 737.9299926757812,
      "date": "2026-09-29",
      "ema20": 726.9624037300465,
      "ema60": 715.3434877377773,
      "ma20": 722.4555969238281,
      "ma60": 713.212124633789,
      "ema20Pct": 1.5086872291414366,
      "ema60Pct": 3.157434900180922,
      "emaCross": "golden",
      "rsi": 59.464259978827435,
      "atr": 9.485906502956977,
      "atrPct": 1.2854751259750907,
      "adx": 13.561056984791007,
      "plusDi": 30.13608554705774,
      "minusDi": 24.66027806596554,
      "macd": 7.60437335765323,
      "macdSignal": 5.373014356840521,
      "macdHist": 2.2313590008127093,
      "volume": 27052300.0,
      "volumeRatio": 0.8385512306591661
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏多：EMA20 在 EMA60 上方（golden），价格站在两条均线上方，MACD 柱为正 2.23，RSI 59.5 处于顺势不极端的健康区间。但 ADX 仅 13.6，说明趋势强度很弱，+DI 30.1 与 -DI 24.7 差距不大，属于震荡偏多的格局，而非强趋势。量比 0.84 显示上攻动能不足。已有一条 long swing 建议在跟踪（entry 741.21，现价 737.93 略低于入场，持有 4/10 天），方向与当前结构一致，无需反向覆盖。考虑到 ADX<20 无明确趋势、且历史样本不足无法校准信心，我倾向维持多头跟踪但不加码，信心度中等偏低。\n\n由于已有 open long 建议且方向一致，本轮不重复下单，维持持有判断。\n\nHOLD：维持现有 long swing 建议跟踪。理由——EMA 多头排列、MACD 柱为正、RSI 健康支撑偏多结构，但 ADX 13.6 表明趋势强度不足、量能偏弱，属震荡偏多而非强趋势，不宜追高加仓；现价略低于入场价，继续持有等待趋势确认，若跌破止损 721.27 则离场。",
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
    "daysOpen": 4,
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
      "daysOpen": 4,
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
