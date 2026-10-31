export const agentData = {
  "agent": {
    "ticker": "QQQ",
    "lastRun": "2026-10-31T00:57:03Z",
    "mode": "live",
    "iterations": 1,
    "error": null
  },
  "latestRun": {
    "thought": "Thought: 当前结构偏空但趋势强度有限。价格 715.34 已跌破 EMA20（724.31）和 EMA60（722.49），虽均线仍是金叉，但价格在均线下方运行，属多头结构走坏。ADX=25.7 且 -DI=35.7 明显高于 +DI=19.8，方向性偏空；RSI=44.5 处于中性偏弱区，未超卖；MACD 柱 -1.805 为负，动能向下。已有 open 的 short swing（entry 725.2，已持有 5/10 天）方向与当前结构一致，浮盈状态，无需反向覆盖。历史样本不足且近期结算多为 loss/expired，胜率不可靠，不宜加码高信心。综合看，维持空头方向但信心度适中，周期用 swing（ADX 虽 25.7 但 EMA60 未与价格同向确认，趋势级别不足）。",
    "action": "submit_suggestion(short, swing, conf=55)",
    "observation": "建议已提交：short swing 信心度 55",
    "asOfDate": "2026-10-29",
    "indicators": {
      "price": 715.3400268554688,
      "date": "2026-10-29",
      "ema20": 724.309370367964,
      "ema60": 722.4876659862131,
      "ma20": 731.1420013427735,
      "ma60": 724.5778055826823,
      "ema20Pct": -1.2383304537312068,
      "ema60Pct": -0.9893095020504727,
      "emaCross": "golden",
      "rsi": 44.454191161642164,
      "atr": 11.24423296786141,
      "atrPct": 1.5718724726322715,
      "adx": 25.670719393221923,
      "plusDi": 19.83397785466906,
      "minusDi": 35.670096335035005,
      "macd": -4.496043950306898,
      "macdSignal": -2.691394470293223,
      "macdHist": -1.8046494800136754,
      "volume": 38251600.0,
      "volumeRatio": 1.1730935190904168
    },
    "trace": [
      {
        "thought": "Thought: 当前结构偏空但趋势强度有限。价格 715.34 已跌破 EMA20（724.31）和 EMA60（722.49），虽均线仍是金叉，但价格在均线下方运行，属多头结构走坏。ADX=25.7 且 -DI=35.7 明显高于 +DI=19.8，方向性偏空；RSI=44.5 处于中性偏弱区，未超卖；MACD 柱 -1.805 为负，动能向下。已有 open 的 short swing（entry 725.2，已持有 5/10 天）方向与当前结构一致，浮盈状态，无需反向覆盖。历史样本不足且近期结算多为 loss/expired，胜率不可靠，不宜加码高信心。综合看，维持空头方向但信心度适中，周期用 swing（ADX 虽 25.7 但 EMA60 未与价格同向确认，趋势级别不足）。",
        "action": "submit_suggestion(short, swing, conf=55)",
        "observation": "建议已提交：short swing 信心度 55"
      }
    ]
  },
  "currentSuggestion": {
    "id": "628ad5c543e2",
    "ticker": "QQQ",
    "createdAt": "2026-10-23T00:04:45Z",
    "issuedAtClose": "2026-10-22",
    "direction": "short",
    "horizon": "swing",
    "entry": 725.2,
    "stop": 747.04,
    "target": 692.45,
    "sizePct": 25.0,
    "atr": 10.9176,
    "confidence": 42,
    "reasoning": "价格失守EMA20且MACD柱转负，-DI(35.3)远超+DI(17.2)方向翻空，但ADX仅21.4趋势弱、量比0.75缩量、EMA20仍在EMA60上方，多头结构未破，故仅给低信心短空。",
    "thought": "Thought: 结构上偏空信号占优。价格跌破 EMA20（-0.94%），MACD 柱为负（-4.294）且动能走弱；更关键的是 -DI=35.3 明显高于 +DI=17.2，方向性指标已翻空，而 ADX=21.4 只是刚过 20 的弱趋势区，说明下跌尚未形成强趋势但方向明确。RSI=46.1 处于中性偏弱，未到超卖，仍有下行空间。EMA20 仍在 EMA60 上方（golden），价格也勉强站在 EMA60 之上（+0.12%），这是唯一的多头支撑，但已岌岌可危。量比 0.75 显示缩量，下跌缺乏放量确认，追空性价比一般。历史胜率样本不足，且最近四条建议三亏一平，说明当前震荡环境下我的方向判断可靠性偏低，应压低信心度。综合看：短线偏空但趋势强度不足、多头结构未完全破坏，属于方向不明朗的矛盾区，不宜重仓押注。倾向轻仓短空或直接观望。考虑到 -DI 大幅领先、MACD 转负、价格失守 EMA20，我选择给一条低信心的 swing 空单，同时明确这是弱信号。",
    "quality": "medium",
    "qualityFlags": [
      "low_confidence"
    ],
    "status": "open",
    "resolvedAt": null,
    "resolvedPrice": null,
    "resolution": null,
    "daysOpen": 5,
    "maxDays": 10
  },
  "winRate": {
    "total": 4,
    "wins": 0,
    "losses": 2,
    "expired": 2,
    "decided": 2,
    "winRate": null,
    "recent10": {
      "winRate": 0.0,
      "count": 4,
      "wins": 0
    },
    "byDirection": {
      "short": {
        "wins": 0,
        "losses": 1,
        "winRate": 0.0
      },
      "long": {
        "wins": 0,
        "losses": 1,
        "winRate": 0.0
      }
    },
    "byHorizon": {
      "swing": {
        "wins": 0,
        "losses": 2,
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
        "losses": 2,
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
      "id": "628ad5c543e2",
      "ticker": "QQQ",
      "createdAt": "2026-10-23T00:04:45Z",
      "issuedAtClose": "2026-10-22",
      "direction": "short",
      "horizon": "swing",
      "entry": 725.2,
      "stop": 747.04,
      "target": 692.45,
      "sizePct": 25.0,
      "atr": 10.9176,
      "confidence": 42,
      "reasoning": "价格失守EMA20且MACD柱转负，-DI(35.3)远超+DI(17.2)方向翻空，但ADX仅21.4趋势弱、量比0.75缩量、EMA20仍在EMA60上方，多头结构未破，故仅给低信心短空。",
      "thought": "Thought: 结构上偏空信号占优。价格跌破 EMA20（-0.94%），MACD 柱为负（-4.294）且动能走弱；更关键的是 -DI=35.3 明显高于 +DI=17.2，方向性指标已翻空，而 ADX=21.4 只是刚过 20 的弱趋势区，说明下跌尚未形成强趋势但方向明确。RSI=46.1 处于中性偏弱，未到超卖，仍有下行空间。EMA20 仍在 EMA60 上方（golden），价格也勉强站在 EMA60 之上（+0.12%），这是唯一的多头支撑，但已岌岌可危。量比 0.75 显示缩量，下跌缺乏放量确认，追空性价比一般。历史胜率样本不足，且最近四条建议三亏一平，说明当前震荡环境下我的方向判断可靠性偏低，应压低信心度。综合看：短线偏空但趋势强度不足、多头结构未完全破坏，属于方向不明朗的矛盾区，不宜重仓押注。倾向轻仓短空或直接观望。考虑到 -DI 大幅领先、MACD 转负、价格失守 EMA20，我选择给一条低信心的 swing 空单，同时明确这是弱信号。",
      "quality": "medium",
      "qualityFlags": [
        "low_confidence"
      ],
      "status": "open",
      "resolvedAt": null,
      "resolvedPrice": null,
      "resolution": null,
      "daysOpen": 5,
      "maxDays": 10
    },
    {
      "id": "70f81d9c84b1",
      "ticker": "QQQ",
      "createdAt": "2026-10-10T01:06:49Z",
      "issuedAtClose": "2026-10-09",
      "direction": "long",
      "horizon": "swing",
      "entry": 747.58,
      "stop": 728.63,
      "target": 776.0,
      "sizePct": 25.0,
      "atr": 9.4733,
      "confidence": 55,
      "reasoning": "EMA20>EMA60 金叉、价格站上双均线且 MACD 柱为正，RSI59 顺势不极端，偏多；但 ADX15.4 趋势强度弱，故仅给中等偏低信心、swing 周期。",
      "thought": "Thought: 当前结构偏多：EMA20 在 EMA60 上方且为 golden 交叉，价格站在两条均线之上（+1.14% / +3.44%），MACD 柱为正 1.342，RSI 59 处于顺势区间且不极端，量比 1.54 有温和放量。唯一的问题是 ADX 仅 15.4，说明趋势强度不足，属于弱趋势/震荡偏多格局，+DI 31 略高于 -DI 27.9 但差距不大，方向性并不牢固。历史样本不足且最近一条 short 已亏损，说明追空不可取；但 ADX 偏低意味着突破持续性存疑，不宜给高信心。综合看，顺势偏多但强度弱，适合以 swing 周期轻仓做多，信心度中等偏低。",
      "quality": "medium",
      "qualityFlags": [
        "choppy_adx_low"
      ],
      "status": "loss",
      "resolvedAt": "2026-10-15",
      "resolvedPrice": 728.0,
      "resolution": "loss",
      "daysOpen": 4,
      "maxDays": 10
    },
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
      "status": "expired",
      "resolvedAt": "2026-10-07",
      "resolvedPrice": 757.73,
      "resolution": "expired",
      "daysOpen": 10,
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
