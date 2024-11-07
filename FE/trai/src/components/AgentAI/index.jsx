import { useState, useEffect } from 'react';
import { instance } from '@api/axios';
import styled from "styled-components";

import QuantAgent from "@components/MultipleAgents/QuantAgent";
import PatternAgent from "@components/MultipleAgents/PatternAgent";
import FngAgent from "@components/MultipleAgents/FngAgent";
import NewsAgent from "@components/MultipleAgents/NewsAgent";
import MasterAgent from "@components/MultipleAgents/MasterAgent";

const fakeData = {
  "messages": [
    {
      "content": "Analysis Started",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "human",
      "name": null,
      "id": "ac089911-8c0d-45cc-bf8a-0263033118b8",
      "example": false
    },
    {
      "content": "FNG Analysis Decision: HOLD, FNG Analysis Summary: 최근 30일 동안의 공포 탐욕 지수를 분석한 결과, 시장은 전반적으로 'Greed' 수준에 머물러 있으며, 특히 최근 20일 동안은 70점 이상을 기록하며 투자자들이 낙관적인 태도를 보이고 있습니다. 그러나, 마지막 10일 동안 지수가 급격히 하락하여 'Neutral' 수준에 가까워졌습니다. 이는 시장의 변동성이 증가하고 있음을 시사하며, 투자자들이 점차 신중한 태도로 전환하고 있음을 나타냅니다. 이러한 상황에서는 시장의 방향성이 명확하지 않기 때문에, 추가적인 시장 정보와 경제 지표를 관찰하며 신중한 접근이 필요합니다. 따라서, 현재로서는 'HOLD' 전략을 유지하며 시장의 변화를 주의 깊게 살펴보는 것이 바람직합니다.",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "human",
      "name": null,
      "id": "8b18867e-6df6-4ab8-a28e-bb93674c71bb",
      "example": false
    },
    {
      "content": "News Search Decision: BUY, News Search Summary: 최근 영국의 연금 펀드가 비트코인에 3%의 자산을 할당했다는 뉴스는 비트코인의 제도적 수용이 증가하고 있음을 보여줍니다. 이는 비트코인이 장기적으로 안정적인 투자 자산으로 자리 잡고 있음을 시사하며, 시장 신뢰도를 높이는 긍정적인 신호로 해석됩니다. 이러한 움직임은 다른 기관 투자자들에게도 영향을 미쳐 추가적인 자금 유입을 유도할 가능성이 높습니다. 따라서 현재 시장 상황에서는 비트코인에 대한 매수(BUY) 결정을 내리는 것이 적절하다고 판단됩니다., Sources: [{'title': 'UK-based pension scheme makes 3% Bitcoin allocation', 'url': 'https://cointelegraph.com/news/uk-pension-scheme-bitcoin-investment'}, {'title': 'UK Pension Fund Makes Historic Bitcoin Investment', 'url': 'https://finance.yahoo.com/news/uk-pension-fund-makes-historic-081255403.html'}, {'title': 'First UK Pension Fund Invests in Bitcoin', 'url': 'https://www.coindesk.com/business/2024/11/04/first-uk-pension-fund-invests-in-bitcoin/'}, {'title': 'UK Pension Fund Makes Direct Investment In Bitcoin', 'url': 'https://www.binance.com/en-TR/square/post/2024-11-04-uk-pension-fund-makes-direct-investment-in-bitcoin-15800329158154'}, {'title': 'UK Pension Fund Breaks New Ground with 3% Bitcoin Investment', 'url': 'https://www.analyticsinsight.net/news/uk-pension-fund-breaks-new-ground-with-3-bitcoin-investment'}, {'title': 'Is Trump’s Crypto Worth the Investment? Experts Weigh In', 'url': 'https://finance.yahoo.com/news/trump-crypto-worth-investment-experts-220047842.html'}, {'title': 'Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment', 'url': 'https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-'}]",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "human",
      "name": null,
      "id": "c52e4742-2376-415e-b237-874a4ed3049c",
      "example": false
    },
    {
      "content": "Quant Analysis Decision: SELL, Quant Analysis Summary: 현재 4시간 캔들 데이터 분석 결과, 데드 크로스가 발생하였고 MACD가 하락 교차 상태에 있습니다. 데드 크로스는 단기 이동 평균선이 장기 이동 평균선 아래로 내려가는 현상으로, 이는 일반적으로 하락 추세의 시작을 의미합니다. 또한, MACD 하락 교차는 모멘텀이 약화되고 있음을 나타내며, 추가적인 하락 가능성을 시사합니다. 이러한 기술적 지표들은 비트코인 가격이 하락할 가능성이 높다는 신호로 해석되므로, 현재 포지션을 정리하고 매도하는 것이 적절한 투자 결정으로 판단됩니다.",
      "additional_kwargs": {},
      "response_metadata": {},
      "type": "human",
      "name": null,
      "id": "28b18234-77a8-44be-ad05-57f710406aac",
      "example": false
    }
  ],
  "fng": {
    "decision": "HOLD",
    "summary": "최근 30일 동안의 공포 탐욕 지수를 분석한 결과, 시장은 전반적으로 'Greed' 수준에 머물러 있으며, 특히 최근 20일 동안은 70점 이상을 기록하며 투자자들이 낙관적인 태도를 보이고 있습니다. 그러나, 마지막 10일 동안 지수가 급격히 하락하여 'Neutral' 수준에 가까워졌습니다. 이는 시장의 변동성이 증가하고 있음을 시사하며, 투자자들이 점차 신중한 태도로 전환하고 있음을 나타냅니다. 이러한 상황에서는 시장의 방향성이 명확하지 않기 때문에, 추가적인 시장 정보와 경제 지표를 관찰하며 신중한 접근이 필요합니다. 따라서, 현재로서는 'HOLD' 전략을 유지하며 시장의 변화를 주의 깊게 살펴보는 것이 바람직합니다."
  },
  "news_search": {
    "decision": "BUY",
    "summary": "최근 영국의 연금 펀드가 비트코인에 3%의 자산을 할당했다는 뉴스는 비트코인의 제도적 수용이 증가하고 있음을 보여줍니다. 이는 비트코인이 장기적으로 안정적인 투자 자산으로 자리 잡고 있음을 시사하며, 시장 신뢰도를 높이는 긍정적인 신호로 해석됩니다. 이러한 움직임은 다른 기관 투자자들에게도 영향을 미쳐 추가적인 자금 유입을 유도할 가능성이 높습니다. 따라서 현재 시장 상황에서는 비트코인에 대한 매수(BUY) 결정을 내리는 것이 적절하다고 판단됩니다.",
    "sources": [
      {
        "title": "UK-based pension scheme makes 3% Bitcoin allocation",
        "url": "https://cointelegraph.com/news/uk-pension-scheme-bitcoin-investment"
      },
      {
        "title": "UK Pension Fund Makes Historic Bitcoin Investment",
        "url": "https://finance.yahoo.com/news/uk-pension-fund-makes-historic-081255403.html"
      },
      {
        "title": "First UK Pension Fund Invests in Bitcoin",
        "url": "https://www.coindesk.com/business/2024/11/04/first-uk-pension-fund-invests-in-bitcoin/"
      },
      {
        "title": "UK Pension Fund Makes Direct Investment In Bitcoin",
        "url": "https://www.binance.com/en-TR/square/post/2024-11-04-uk-pension-fund-makes-direct-investment-in-bitcoin-15800329158154"
      },
      {
        "title": "UK Pension Fund Breaks New Ground with 3% Bitcoin Investment",
        "url": "https://www.analyticsinsight.net/news/uk-pension-fund-breaks-new-ground-with-3-bitcoin-investment"
      },
      {
        "title": "Is Trump’s Crypto Worth the Investment? Experts Weigh In",
        "url": "https://finance.yahoo.com/news/trump-crypto-worth-investment-experts-220047842.html"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      },
      {
        "title": "Companies Holding Bitcoin on Their Balance Sheets: A Strategic Investment",
        "url": "https://www.thestreet.com/crypto/innovation/companies-holding-bitcoin-on-their-balance-sheets-a-strategic-investment-"
      }
    ]
  },
  "quant": {
    "decision": "SELL",
    "summary": "현재 4시간 캔들 데이터 분석 결과, 데드 크로스가 발생하였고 MACD가 하락 교차 상태에 있습니다. 데드 크로스는 단기 이동 평균선이 장기 이동 평균선 아래로 내려가는 현상으로, 이는 일반적으로 하락 추세의 시작을 의미합니다. 또한, MACD 하락 교차는 모멘텀이 약화되고 있음을 나타내며, 추가적인 하락 가능성을 시사합니다. 이러한 기술적 지표들은 비트코인 가격이 하락할 가능성이 높다는 신호로 해석되므로, 현재 포지션을 정리하고 매도하는 것이 적절한 투자 결정으로 판단됩니다.",
    "raw_data": [
      {
        "candle_date_time_kst": "2024-11-06T09:00:00",
        "close": 99081000,
        "high": 99399000,
        "low": 96104000,
        "open": 96196000,
        "volume": 1019.19524641
      },
      {
        "candle_date_time_kst": "2024-11-06T05:00:00",
        "close": 96170000,
        "high": 97075000,
        "low": 95503000,
        "open": 96129000,
        "volume": 665.16818738
      },
      {
        "candle_date_time_kst": "2024-11-06T01:00:00",
        "close": 96205000,
        "high": 98000000,
        "low": 95940000,
        "open": 96903000,
        "volume": 605.82505508
      },
      {
        "candle_date_time_kst": "2024-11-05T21:00:00",
        "close": 96875000,
        "high": 98074000,
        "low": 95655000,
        "open": 95960000,
        "volume": 1379.51476132
      },
      {
        "candle_date_time_kst": "2024-11-05T17:00:00",
        "close": 95960000,
        "high": 96530000,
        "low": 95500000,
        "open": 96250000,
        "volume": 610.61031696
      },
      {
        "candle_date_time_kst": "2024-11-05T13:00:00",
        "close": 96214000,
        "high": 96446000,
        "low": 94933000,
        "open": 94999000,
        "volume": 903.71399013
      },
      {
        "candle_date_time_kst": "2024-11-05T09:00:00",
        "close": 95000000,
        "high": 95000000,
        "low": 93958000,
        "open": 94289000,
        "volume": 620.98519735
      },
      {
        "candle_date_time_kst": "2024-11-05T05:00:00",
        "close": 94289000,
        "high": 94675000,
        "low": 93083000,
        "open": 94675000,
        "volume": 951.66622524
      },
      {
        "candle_date_time_kst": "2024-11-05T01:00:00",
        "close": 94674000,
        "high": 95500000,
        "low": 93880000,
        "open": 95447000,
        "volume": 558.83978755
      },
      {
        "candle_date_time_kst": "2024-11-04T21:00:00",
        "close": 95452000,
        "high": 96239000,
        "low": 94850000,
        "open": 95604000,
        "volume": 584.44807331
      },
      {
        "candle_date_time_kst": "2024-11-04T17:00:00",
        "close": 95633000,
        "high": 95818000,
        "low": 95036000,
        "open": 95290000,
        "volume": 333.6153382
      },
      {
        "candle_date_time_kst": "2024-11-04T13:00:00",
        "close": 95300000,
        "high": 96423000,
        "low": 95000000,
        "open": 96021000,
        "volume": 438.14671583
      },
      {
        "candle_date_time_kst": "2024-11-04T09:00:00",
        "close": 96021000,
        "high": 96803000,
        "low": 94801000,
        "open": 95987000,
        "volume": 690.17567869
      },
      {
        "candle_date_time_kst": "2024-11-04T05:00:00",
        "close": 95883000,
        "high": 97167000,
        "low": 95550000,
        "open": 96059000,
        "volume": 603.14876379
      },
      {
        "candle_date_time_kst": "2024-11-04T01:00:00",
        "close": 96086000,
        "high": 96086000,
        "low": 94700000,
        "open": 94999000,
        "volume": 355.51089083
      },
      {
        "candle_date_time_kst": "2024-11-03T21:00:00",
        "close": 94997000,
        "high": 95651000,
        "low": 93905000,
        "open": 95226000,
        "volume": 1302.13485646
      },
      {
        "candle_date_time_kst": "2024-11-03T17:00:00",
        "close": 95226000,
        "high": 95950000,
        "low": 95050000,
        "open": 95706000,
        "volume": 663.938954
      },
      {
        "candle_date_time_kst": "2024-11-03T13:00:00",
        "close": 95699000,
        "high": 96386000,
        "low": 95600000,
        "open": 95950000,
        "volume": 398.04172937
      },
      {
        "candle_date_time_kst": "2024-11-03T09:00:00",
        "close": 95950000,
        "high": 97232000,
        "low": 95271000,
        "open": 97205000,
        "volume": 1035.38194246
      },
      {
        "candle_date_time_kst": "2024-11-03T05:00:00",
        "close": 97205000,
        "high": 97688000,
        "low": 96825000,
        "open": 97630000,
        "volume": 182.29586852
      },
      {
        "candle_date_time_kst": "2024-11-03T01:00:00",
        "close": 97629000,
        "high": 97661000,
        "low": 97161000,
        "open": 97197000,
        "volume": 127.80241448
      },
      {
        "candle_date_time_kst": "2024-11-02T21:00:00",
        "close": 97280000,
        "high": 97697000,
        "low": 96825000,
        "open": 97470000,
        "volume": 458.12308315
      },
      {
        "candle_date_time_kst": "2024-11-02T17:00:00",
        "close": 97469000,
        "high": 97890000,
        "low": 97310000,
        "open": 97860000,
        "volume": 213.0905468
      },
      {
        "candle_date_time_kst": "2024-11-02T13:00:00",
        "close": 97860000,
        "high": 97860000,
        "low": 97375000,
        "open": 97502000,
        "volume": 166.61236855
      },
      {
        "candle_date_time_kst": "2024-11-02T09:00:00",
        "close": 97502000,
        "high": 97999000,
        "low": 97055000,
        "open": 97331000,
        "volume": 271.28635163
      },
      {
        "candle_date_time_kst": "2024-11-02T05:00:00",
        "close": 97285000,
        "high": 97554000,
        "low": 96550000,
        "open": 97041000,
        "volume": 240.12042823
      },
      {
        "candle_date_time_kst": "2024-11-02T01:00:00",
        "close": 97066000,
        "high": 98500000,
        "low": 96350000,
        "open": 96936000,
        "volume": 426.07932327
      },
      {
        "candle_date_time_kst": "2024-11-01T21:00:00",
        "close": 96936000,
        "high": 99758000,
        "low": 96539000,
        "open": 97660000,
        "volume": 1383.44824034
      },
      {
        "candle_date_time_kst": "2024-11-01T17:00:00",
        "close": 97686000,
        "high": 98070000,
        "low": 96350000,
        "open": 96458000,
        "volume": 574.58399802
      },
      {
        "candle_date_time_kst": "2024-11-01T13:00:00",
        "close": 96458000,
        "high": 97125000,
        "low": 96160000,
        "open": 96603000,
        "volume": 479.37892342
      },
      {
        "candle_date_time_kst": "2024-11-01T09:00:00",
        "close": 96603000,
        "high": 98535000,
        "low": 95520000,
        "open": 98112000,
        "volume": 1747.27169009
      },
      {
        "candle_date_time_kst": "2024-11-01T05:00:00",
        "close": 98112000,
        "high": 98568000,
        "low": 97300000,
        "open": 98010000,
        "volume": 786.7880392
      },
      {
        "candle_date_time_kst": "2024-11-01T01:00:00",
        "close": 98010000,
        "high": 99045000,
        "low": 98000000,
        "open": 98721000,
        "volume": 468.60582815
      },
      {
        "candle_date_time_kst": "2024-10-31T21:00:00",
        "close": 98672000,
        "high": 100595000,
        "low": 98448000,
        "open": 100540000,
        "volume": 1549.46422696
      },
      {
        "candle_date_time_kst": "2024-10-31T17:00:00",
        "close": 100535000,
        "high": 100893000,
        "low": 100370000,
        "open": 100684000,
        "volume": 290.68750816
      },
      {
        "candle_date_time_kst": "2024-10-31T13:00:00",
        "close": 100684000,
        "high": 100700000,
        "low": 100300000,
        "open": 100513000,
        "volume": 243.14218322
      },
      {
        "candle_date_time_kst": "2024-10-31T09:00:00",
        "close": 100512000,
        "high": 100800000,
        "low": 100166000,
        "open": 100571000,
        "volume": 331.53884727
      },
      {
        "candle_date_time_kst": "2024-10-31T05:00:00",
        "close": 100571000,
        "high": 101000000,
        "low": 99700000,
        "open": 99910000,
        "volume": 403.99845518
      },
      {
        "candle_date_time_kst": "2024-10-31T01:00:00",
        "close": 99906000,
        "high": 100239000,
        "low": 99708000,
        "open": 100200000,
        "volume": 139.6885191
      },
      {
        "candle_date_time_kst": "2024-10-30T21:00:00",
        "close": 100200000,
        "high": 100500000,
        "low": 99135000,
        "open": 100077000,
        "volume": 1027.56342974
      },
      {
        "candle_date_time_kst": "2024-10-30T17:00:00",
        "close": 100064000,
        "high": 100776000,
        "low": 99923000,
        "open": 100500000,
        "volume": 410.98738641
      },
      {
        "candle_date_time_kst": "2024-10-30T13:00:00",
        "close": 100508000,
        "high": 100799000,
        "low": 100150000,
        "open": 100202000,
        "volume": 351.02985999
      },
      {
        "candle_date_time_kst": "2024-10-30T09:00:00",
        "close": 100210000,
        "high": 101305000,
        "low": 99711000,
        "open": 101300000,
        "volume": 1104.04831708
      },
      {
        "candle_date_time_kst": "2024-10-30T05:00:00",
        "close": 101305000,
        "high": 101507000,
        "low": 100077000,
        "open": 100901000,
        "volume": 719.63628218
      },
      {
        "candle_date_time_kst": "2024-10-30T01:00:00",
        "close": 100911000,
        "high": 102158000,
        "low": 100477000,
        "open": 100477000,
        "volume": 955.81210022
      },
      {
        "candle_date_time_kst": "2024-10-29T21:00:00",
        "close": 100480000,
        "high": 100480000,
        "low": 98850000,
        "open": 99576000,
        "volume": 1525.15067142
      },
      {
        "candle_date_time_kst": "2024-10-29T17:00:00",
        "close": 99577000,
        "high": 99755000,
        "low": 98865000,
        "open": 98865000,
        "volume": 569.91224197
      },
      {
        "candle_date_time_kst": "2024-10-29T13:00:00",
        "close": 98918000,
        "high": 99200000,
        "low": 98554000,
        "open": 98702000,
        "volume": 568.87686087
      },
      {
        "candle_date_time_kst": "2024-10-29T09:00:00",
        "close": 98702000,
        "high": 99280000,
        "low": 97200000,
        "open": 97401000,
        "volume": 1355.19364048
      },
      {
        "candle_date_time_kst": "2024-10-29T05:00:00",
        "close": 97401000,
        "high": 97714000,
        "low": 96654000,
        "open": 96850000,
        "volume": 670.86020376
      },
      {
        "candle_date_time_kst": "2024-10-29T01:00:00",
        "close": 96851000,
        "high": 97134000,
        "low": 95726000,
        "open": 95770000,
        "volume": 446.38620238
      },
      {
        "candle_date_time_kst": "2024-10-28T21:00:00",
        "close": 95771000,
        "high": 96500000,
        "low": 95627000,
        "open": 95749000,
        "volume": 991.54249912
      },
      {
        "candle_date_time_kst": "2024-10-28T17:00:00",
        "close": 95754000,
        "high": 95866000,
        "low": 95020000,
        "open": 95238000,
        "volume": 458.75690428
      },
      {
        "candle_date_time_kst": "2024-10-28T13:00:00",
        "close": 95239000,
        "high": 95495000,
        "low": 94520000,
        "open": 94646000,
        "volume": 484.40826037
      },
      {
        "candle_date_time_kst": "2024-10-28T09:00:00",
        "close": 94646000,
        "high": 95042000,
        "low": 94563000,
        "open": 94824000,
        "volume": 395.13561521
      },
      {
        "candle_date_time_kst": "2024-10-28T05:00:00",
        "close": 94819000,
        "high": 95120000,
        "low": 94670000,
        "open": 94738000,
        "volume": 368.60001426
      },
      {
        "candle_date_time_kst": "2024-10-28T01:00:00",
        "close": 94738000,
        "high": 94802000,
        "low": 94439000,
        "open": 94729000,
        "volume": 148.39839879
      },
      {
        "candle_date_time_kst": "2024-10-27T21:00:00",
        "close": 94733000,
        "high": 94781000,
        "low": 94003000,
        "open": 94047000,
        "volume": 491.32778956
      },
      {
        "candle_date_time_kst": "2024-10-27T17:00:00",
        "close": 94047000,
        "high": 94126000,
        "low": 93900000,
        "open": 94086000,
        "volume": 166.40597632
      },
      {
        "candle_date_time_kst": "2024-10-27T13:00:00",
        "close": 94018000,
        "high": 94176000,
        "low": 93990000,
        "open": 94166000,
        "volume": 92.00820542
      },
      {
        "candle_date_time_kst": "2024-10-27T09:00:00",
        "close": 94116000,
        "high": 94175000,
        "low": 93902000,
        "open": 93993000,
        "volume": 146.03326186
      },
      {
        "candle_date_time_kst": "2024-10-27T05:00:00",
        "close": 93993000,
        "high": 94298000,
        "low": 93928000,
        "open": 94048000,
        "volume": 107.50965939
      },
      {
        "candle_date_time_kst": "2024-10-27T01:00:00",
        "close": 94030000,
        "high": 94124000,
        "low": 93802000,
        "open": 93885000,
        "volume": 54.84461098
      },
      {
        "candle_date_time_kst": "2024-10-26T21:00:00",
        "close": 93885000,
        "high": 94117000,
        "low": 93650000,
        "open": 94091000,
        "volume": 189.02166093
      },
      {
        "candle_date_time_kst": "2024-10-26T17:00:00",
        "close": 94090000,
        "high": 94261000,
        "low": 93878000,
        "open": 93892000,
        "volume": 189.19792334
      },
      {
        "candle_date_time_kst": "2024-10-26T13:00:00",
        "close": 93878000,
        "high": 94162000,
        "low": 93643000,
        "open": 93846000,
        "volume": 230.36619586
      },
      {
        "candle_date_time_kst": "2024-10-26T09:00:00",
        "close": 93811000,
        "high": 93995000,
        "low": 93297000,
        "open": 93762000,
        "volume": 411.0182611
      },
      {
        "candle_date_time_kst": "2024-10-26T05:00:00",
        "close": 93762000,
        "high": 94300000,
        "low": 92432000,
        "open": 93550000,
        "volume": 841.39585222
      },
      {
        "candle_date_time_kst": "2024-10-26T01:00:00",
        "close": 93550000,
        "high": 94460000,
        "low": 92726000,
        "open": 94230000,
        "volume": 637.26765572
      },
      {
        "candle_date_time_kst": "2024-10-25T21:00:00",
        "close": 94266000,
        "high": 95143000,
        "low": 93912000,
        "open": 94510000,
        "volume": 928.36184883
      },
      {
        "candle_date_time_kst": "2024-10-25T17:00:00",
        "close": 94511000,
        "high": 94511000,
        "low": 93699000,
        "open": 93817000,
        "volume": 319.56092445
      },
      {
        "candle_date_time_kst": "2024-10-25T13:00:00",
        "close": 93816000,
        "high": 94172000,
        "low": 93589000,
        "open": 94124000,
        "volume": 323.70551378
      },
      {
        "candle_date_time_kst": "2024-10-25T09:00:00",
        "close": 94124000,
        "high": 94300000,
        "low": 93620000,
        "open": 94077000,
        "volume": 402.97768382
      },
      {
        "candle_date_time_kst": "2024-10-25T05:00:00",
        "close": 94077000,
        "high": 94699000,
        "low": 93849000,
        "open": 94120000,
        "volume": 508.0991172
      },
      {
        "candle_date_time_kst": "2024-10-25T01:00:00",
        "close": 94057000,
        "high": 94127000,
        "low": 93237000,
        "open": 93603000,
        "volume": 221.64692369
      },
      {
        "candle_date_time_kst": "2024-10-24T21:00:00",
        "close": 93603000,
        "high": 93803000,
        "low": 93015000,
        "open": 93015000,
        "volume": 656.50699207
      },
      {
        "candle_date_time_kst": "2024-10-24T17:00:00",
        "close": 93049000,
        "high": 93109000,
        "low": 92219000,
        "open": 92785000,
        "volume": 296.60654867
      },
      {
        "candle_date_time_kst": "2024-10-24T13:00:00",
        "close": 92785000,
        "high": 93151000,
        "low": 92750000,
        "open": 92763000,
        "volume": 223.41115881
      },
      {
        "candle_date_time_kst": "2024-10-24T09:00:00",
        "close": 92763000,
        "high": 93330000,
        "low": 92080000,
        "open": 92375000,
        "volume": 562.27234177
      },
      {
        "candle_date_time_kst": "2024-10-24T05:00:00",
        "close": 92375000,
        "high": 92454000,
        "low": 91895000,
        "open": 92120000,
        "volume": 216.27025173
      },
      {
        "candle_date_time_kst": "2024-10-24T01:00:00",
        "close": 92150000,
        "high": 92383000,
        "low": 90860000,
        "open": 91760000,
        "volume": 502.33571338
      },
      {
        "candle_date_time_kst": "2024-10-23T21:00:00",
        "close": 91760000,
        "high": 92490000,
        "low": 91500000,
        "open": 91876000,
        "volume": 442.06924082
      },
      {
        "candle_date_time_kst": "2024-10-23T17:00:00",
        "close": 91876000,
        "high": 92650000,
        "low": 91726000,
        "open": 92474000,
        "volume": 486.35504047
      },
      {
        "candle_date_time_kst": "2024-10-23T13:00:00",
        "close": 92475000,
        "high": 92770000,
        "low": 92330000,
        "open": 92600000,
        "volume": 205.24220187
      },
      {
        "candle_date_time_kst": "2024-10-23T09:00:00",
        "close": 92582000,
        "high": 93000000,
        "low": 92397000,
        "open": 92877000,
        "volume": 317.49831354
      },
      {
        "candle_date_time_kst": "2024-10-23T05:00:00",
        "close": 92877000,
        "high": 93380000,
        "low": 92699000,
        "open": 92764000,
        "volume": 275.51396467
      },
      {
        "candle_date_time_kst": "2024-10-23T01:00:00",
        "close": 92764000,
        "high": 92897000,
        "low": 92140000,
        "open": 92504000,
        "volume": 136.16767711
      },
      {
        "candle_date_time_kst": "2024-10-22T21:00:00",
        "close": 92483000,
        "high": 92800000,
        "low": 91818000,
        "open": 92405000,
        "volume": 451.68640462
      },
      {
        "candle_date_time_kst": "2024-10-22T17:00:00",
        "close": 92405000,
        "high": 92773000,
        "low": 91700000,
        "open": 92500000,
        "volume": 463.6000756
      },
      {
        "candle_date_time_kst": "2024-10-22T13:00:00",
        "close": 92500000,
        "high": 92997000,
        "low": 92265000,
        "open": 92392000,
        "volume": 348.54066796
      },
      {
        "candle_date_time_kst": "2024-10-22T09:00:00",
        "close": 92392000,
        "high": 92807000,
        "low": 91090000,
        "open": 92161000,
        "volume": 715.3945956
      },
      {
        "candle_date_time_kst": "2024-10-22T05:00:00",
        "close": 92161000,
        "high": 93103000,
        "low": 92161000,
        "open": 92702000,
        "volume": 309.65991235
      },
      {
        "candle_date_time_kst": "2024-10-22T01:00:00",
        "close": 92701000,
        "high": 92899000,
        "low": 91624000,
        "open": 92140000,
        "volume": 251.81976991
      },
      {
        "candle_date_time_kst": "2024-10-21T21:00:00",
        "close": 92161000,
        "high": 93430000,
        "low": 91459000,
        "open": 93208000,
        "volume": 1267.13046982
      },
      {
        "candle_date_time_kst": "2024-10-21T17:00:00",
        "close": 93250000,
        "high": 93844000,
        "low": 92861000,
        "open": 93622000,
        "volume": 576.93357567
      },
      {
        "candle_date_time_kst": "2024-10-21T13:00:00",
        "close": 93622000,
        "high": 94303000,
        "low": 93606000,
        "open": 94014000,
        "volume": 458.74960714
      },
      {
        "candle_date_time_kst": "2024-10-21T09:00:00",
        "close": 94014000,
        "high": 94456000,
        "low": 93583000,
        "open": 93901000,
        "volume": 628.37621297
      },
      {
        "candle_date_time_kst": "2024-10-21T05:00:00",
        "close": 93901000,
        "high": 94299000,
        "low": 93420000,
        "open": 93441000,
        "volume": 521.56509205
      },
      {
        "candle_date_time_kst": "2024-10-21T01:00:00",
        "close": 93441000,
        "high": 93630000,
        "low": 93372000,
        "open": 93595000,
        "volume": 141.75977904
      },
      {
        "candle_date_time_kst": "2024-10-20T21:00:00",
        "close": 93600000,
        "high": 93881000,
        "low": 93278000,
        "open": 93573000,
        "volume": 483.52818984
      },
      {
        "candle_date_time_kst": "2024-10-20T17:00:00",
        "close": 93573000,
        "high": 93599000,
        "low": 93277000,
        "open": 93299000,
        "volume": 221.98536519
      },
      {
        "candle_date_time_kst": "2024-10-20T13:00:00",
        "close": 93285000,
        "high": 93399000,
        "low": 92956000,
        "open": 92995000,
        "volume": 185.9949046
      },
      {
        "candle_date_time_kst": "2024-10-20T09:00:00",
        "close": 92980000,
        "high": 93400000,
        "low": 92960000,
        "open": 93322000,
        "volume": 211.19773674
      },
      {
        "candle_date_time_kst": "2024-10-20T05:00:00",
        "close": 93322000,
        "high": 93403000,
        "low": 93097000,
        "open": 93100000,
        "volume": 98.01159428
      },
      {
        "candle_date_time_kst": "2024-10-20T01:00:00",
        "close": 93100000,
        "high": 93165000,
        "low": 92769000,
        "open": 93066000,
        "volume": 156.90119139
      },
      {
        "candle_date_time_kst": "2024-10-19T21:00:00",
        "close": 93066000,
        "high": 93330000,
        "low": 93060000,
        "open": 93143000,
        "volume": 214.75890647
      },
      {
        "candle_date_time_kst": "2024-10-19T17:00:00",
        "close": 93144000,
        "high": 93593000,
        "low": 93144000,
        "open": 93297000,
        "volume": 225.25834517
      },
      {
        "candle_date_time_kst": "2024-10-19T13:00:00",
        "close": 93297000,
        "high": 93479000,
        "low": 93166000,
        "open": 93353000,
        "volume": 187.62913614
      },
      {
        "candle_date_time_kst": "2024-10-19T09:00:00",
        "close": 93353000,
        "high": 93529000,
        "low": 93130000,
        "open": 93358000,
        "volume": 321.58448765
      },
      {
        "candle_date_time_kst": "2024-10-19T05:00:00",
        "close": 93330000,
        "high": 93544000,
        "low": 93074000,
        "open": 93381000,
        "volume": 255.23323225
      },
      {
        "candle_date_time_kst": "2024-10-19T01:00:00",
        "close": 93389000,
        "high": 93689000,
        "low": 93056000,
        "open": 93600000,
        "volume": 313.5784554
      },
      {
        "candle_date_time_kst": "2024-10-18T21:00:00",
        "close": 93600000,
        "high": 93697000,
        "low": 92340000,
        "open": 92480000,
        "volume": 748.80431338
      },
      {
        "candle_date_time_kst": "2024-10-18T17:00:00",
        "close": 92480000,
        "high": 92693000,
        "low": 92414000,
        "open": 92530000,
        "volume": 283.87002259
      },
      {
        "candle_date_time_kst": "2024-10-18T13:00:00",
        "close": 92543000,
        "high": 92980000,
        "low": 91993000,
        "open": 91995000,
        "volume": 520.87063469
      },
      {
        "candle_date_time_kst": "2024-10-18T09:00:00",
        "close": 91995000,
        "high": 92490000,
        "low": 91510000,
        "open": 91758000,
        "volume": 581.0467977
      },
      {
        "candle_date_time_kst": "2024-10-18T05:00:00",
        "close": 91725000,
        "high": 91885000,
        "low": 91303000,
        "open": 91357000,
        "volume": 218.55336499
      },
      {
        "candle_date_time_kst": "2024-10-18T01:00:00",
        "close": 91323000,
        "high": 91980000,
        "low": 91280000,
        "open": 91949000,
        "volume": 153.49562935
      },
      {
        "candle_date_time_kst": "2024-10-17T21:00:00",
        "close": 91949000,
        "high": 92000000,
        "low": 91151000,
        "open": 91294000,
        "volume": 480.25326687
      },
      {
        "candle_date_time_kst": "2024-10-17T17:00:00",
        "close": 91293000,
        "high": 91980000,
        "low": 91203000,
        "open": 91320000,
        "volume": 533.93998834
      },
      {
        "candle_date_time_kst": "2024-10-17T13:00:00",
        "close": 91400000,
        "high": 91756000,
        "low": 91150000,
        "open": 91724000,
        "volume": 404.51159466
      },
      {
        "candle_date_time_kst": "2024-10-17T09:00:00",
        "close": 91724000,
        "high": 91999000,
        "low": 91401000,
        "open": 91610000,
        "volume": 376.14787631
      },
      {
        "candle_date_time_kst": "2024-10-17T05:00:00",
        "close": 91610000,
        "high": 91980000,
        "low": 91300000,
        "open": 91788000,
        "volume": 262.62042622
      },
      {
        "candle_date_time_kst": "2024-10-17T01:00:00",
        "close": 91788000,
        "high": 92100000,
        "low": 91560000,
        "open": 91732000,
        "volume": 154.13142184
      },
      {
        "candle_date_time_kst": "2024-10-16T21:00:00",
        "close": 91732000,
        "high": 92340000,
        "low": 91000000,
        "open": 91787000,
        "volume": 875.22490127
      },
      {
        "candle_date_time_kst": "2024-10-16T17:00:00",
        "close": 91786000,
        "high": 92350000,
        "low": 90733000,
        "open": 90747000,
        "volume": 913.50291465
      },
      {
        "candle_date_time_kst": "2024-10-16T13:00:00",
        "close": 90747000,
        "high": 91128000,
        "low": 90500000,
        "open": 90868000,
        "volume": 368.06608415
      },
      {
        "candle_date_time_kst": "2024-10-16T09:00:00",
        "close": 90868000,
        "high": 91458000,
        "low": 90194000,
        "open": 90518000,
        "volume": 717.40892405
      },
      {
        "candle_date_time_kst": "2024-10-16T05:00:00",
        "close": 90600000,
        "high": 90740000,
        "low": 89600000,
        "open": 90531000,
        "volume": 530.14608621
      },
      {
        "candle_date_time_kst": "2024-10-16T01:00:00",
        "close": 90630000,
        "high": 90940000,
        "low": 89334000,
        "open": 89334000,
        "volume": 495.1997807
      },
      {
        "candle_date_time_kst": "2024-10-15T21:00:00",
        "close": 89348000,
        "high": 91531000,
        "low": 87900000,
        "open": 88500000,
        "volume": 2661.25431094
      },
      {
        "candle_date_time_kst": "2024-10-15T17:00:00",
        "close": 88500000,
        "high": 88753000,
        "low": 88260000,
        "open": 88440000,
        "volume": 351.02872308
      },
      {
        "candle_date_time_kst": "2024-10-15T13:00:00",
        "close": 88440000,
        "high": 88665000,
        "low": 87563000,
        "open": 87578000,
        "volume": 542.76802048
      },
      {
        "candle_date_time_kst": "2024-10-15T09:00:00",
        "close": 87576000,
        "high": 88802000,
        "low": 87510000,
        "open": 88640000,
        "volume": 739.68373252
      },
      {
        "candle_date_time_kst": "2024-10-15T05:00:00",
        "close": 88640000,
        "high": 88963000,
        "low": 88200000,
        "open": 88387000,
        "volume": 395.04872835
      },
      {
        "candle_date_time_kst": "2024-10-15T01:00:00",
        "close": 88301000,
        "high": 88459000,
        "low": 87855000,
        "open": 88302000,
        "volume": 266.56102781
      },
      {
        "candle_date_time_kst": "2024-10-14T21:00:00",
        "close": 88302000,
        "high": 88811000,
        "low": 86900000,
        "open": 87320000,
        "volume": 1314.74102363
      },
      {
        "candle_date_time_kst": "2024-10-14T17:00:00",
        "close": 87325000,
        "high": 87449000,
        "low": 86592000,
        "open": 86921000,
        "volume": 814.57223744
      },
      {
        "candle_date_time_kst": "2024-10-14T13:00:00",
        "close": 86928000,
        "high": 87000000,
        "low": 85764000,
        "open": 86540000,
        "volume": 907.02436926
      },
      {
        "candle_date_time_kst": "2024-10-14T09:00:00",
        "close": 86540000,
        "high": 86630000,
        "low": 84300000,
        "open": 84782000,
        "volume": 804.99027896
      },
      {
        "candle_date_time_kst": "2024-10-14T05:00:00",
        "close": 84806000,
        "high": 84811000,
        "low": 84225000,
        "open": 84580000,
        "volume": 106.56230397
      },
      {
        "candle_date_time_kst": "2024-10-14T01:00:00",
        "close": 84580000,
        "high": 84650000,
        "low": 84063000,
        "open": 84159000,
        "volume": 36.43282786
      },
      {
        "candle_date_time_kst": "2024-10-13T21:00:00",
        "close": 84159000,
        "high": 84727000,
        "low": 83890000,
        "open": 84356000,
        "volume": 285.10526144
      },
      {
        "candle_date_time_kst": "2024-10-13T17:00:00",
        "close": 84356000,
        "high": 84860000,
        "low": 84346000,
        "open": 84740000,
        "volume": 176.92382393
      },
      {
        "candle_date_time_kst": "2024-10-13T13:00:00",
        "close": 84704000,
        "high": 84900000,
        "low": 84500000,
        "open": 84536000,
        "volume": 120.30981913
      },
      {
        "candle_date_time_kst": "2024-10-13T09:00:00",
        "close": 84536000,
        "high": 85181000,
        "low": 84450000,
        "open": 84997000,
        "volume": 282.30924681
      },
      {
        "candle_date_time_kst": "2024-10-13T05:00:00",
        "close": 84956000,
        "high": 85142000,
        "low": 84803000,
        "open": 84803000,
        "volume": 114.88567771
      },
      {
        "candle_date_time_kst": "2024-10-13T01:00:00",
        "close": 84807000,
        "high": 85222000,
        "low": 84752000,
        "open": 84968000,
        "volume": 92.8748169
      },
      {
        "candle_date_time_kst": "2024-10-12T21:00:00",
        "close": 84963000,
        "high": 85250000,
        "low": 84710000,
        "open": 84834000,
        "volume": 316.15749269
      },
      {
        "candle_date_time_kst": "2024-10-12T17:00:00",
        "close": 84835000,
        "high": 85190000,
        "low": 84629000,
        "open": 84800000,
        "volume": 220.29368958
      },
      {
        "candle_date_time_kst": "2024-10-12T13:00:00",
        "close": 84850000,
        "high": 84850000,
        "low": 84450000,
        "open": 84454000,
        "volume": 142.46987184
      },
      {
        "candle_date_time_kst": "2024-10-12T09:00:00",
        "close": 84459000,
        "high": 85094000,
        "low": 84330000,
        "open": 84450000,
        "volume": 349.45148741
      },
      {
        "candle_date_time_kst": "2024-10-12T05:00:00",
        "close": 84451000,
        "high": 85175000,
        "low": 84101000,
        "open": 85093000,
        "volume": 396.20530103
      },
      {
        "candle_date_time_kst": "2024-10-12T01:00:00",
        "close": 85099000,
        "high": 85474000,
        "low": 84101000,
        "open": 84218000,
        "volume": 507.2704258
      },
      {
        "candle_date_time_kst": "2024-10-11T21:00:00",
        "close": 84108000,
        "high": 84390000,
        "low": 82900000,
        "open": 82938000,
        "volume": 600.21757582
      },
      {
        "candle_date_time_kst": "2024-10-11T17:00:00",
        "close": 82938000,
        "high": 83000000,
        "low": 81968000,
        "open": 82297000,
        "volume": 309.72290284
      },
      {
        "candle_date_time_kst": "2024-10-11T13:00:00",
        "close": 82297000,
        "high": 82600000,
        "low": 82111000,
        "open": 82305000,
        "volume": 208.89548511
      },
      {
        "candle_date_time_kst": "2024-10-11T09:00:00",
        "close": 82340000,
        "high": 82449000,
        "low": 81749000,
        "open": 82131000,
        "volume": 269.94005615
      },
      {
        "candle_date_time_kst": "2024-10-11T05:00:00",
        "close": 82131000,
        "high": 82212000,
        "low": 81258000,
        "open": 81382000,
        "volume": 270.21707249
      },
      {
        "candle_date_time_kst": "2024-10-11T01:00:00",
        "close": 81381000,
        "high": 82811000,
        "low": 80635000,
        "open": 82568000,
        "volume": 695.93296508
      },
      {
        "candle_date_time_kst": "2024-10-10T21:00:00",
        "close": 82566000,
        "high": 83127000,
        "low": 82200000,
        "open": 83025000,
        "volume": 401.5988831
      },
      {
        "candle_date_time_kst": "2024-10-10T17:00:00",
        "close": 83025000,
        "high": 83071000,
        "low": 82353000,
        "open": 82600000,
        "volume": 258.2143783
      },
      {
        "candle_date_time_kst": "2024-10-10T13:00:00",
        "close": 82566000,
        "high": 82755000,
        "low": 82417000,
        "open": 82486000,
        "volume": 185.31863709
      },
      {
        "candle_date_time_kst": "2024-10-10T09:00:00",
        "close": 82485000,
        "high": 82736000,
        "low": 81901000,
        "open": 82383000,
        "volume": 450.34877823
      },
      {
        "candle_date_time_kst": "2024-10-10T05:00:00",
        "close": 82385000,
        "high": 83072000,
        "low": 82187000,
        "open": 82915000,
        "volume": 442.62169775
      },
      {
        "candle_date_time_kst": "2024-10-10T01:00:00",
        "close": 82915000,
        "high": 84295000,
        "low": 82690000,
        "open": 84206000,
        "volume": 314.93719439
      },
      {
        "candle_date_time_kst": "2024-10-09T21:00:00",
        "close": 84206000,
        "high": 84323000,
        "low": 83505000,
        "open": 84115000,
        "volume": 442.64765705
      },
      {
        "candle_date_time_kst": "2024-10-09T17:00:00",
        "close": 84115000,
        "high": 84288000,
        "low": 84066000,
        "open": 84286000,
        "volume": 134.5036213
      },
      {
        "candle_date_time_kst": "2024-10-09T13:00:00",
        "close": 84286000,
        "high": 84500000,
        "low": 84238000,
        "open": 84350000,
        "volume": 100.71049484
      },
      {
        "candle_date_time_kst": "2024-10-09T09:00:00",
        "close": 84350000,
        "high": 84496000,
        "low": 84000000,
        "open": 84139000,
        "volume": 187.87769335
      },
      {
        "candle_date_time_kst": "2024-10-09T05:00:00",
        "close": 84139000,
        "high": 84507000,
        "low": 84075000,
        "open": 84378000,
        "volume": 113.61125875
      },
      {
        "candle_date_time_kst": "2024-10-09T01:00:00",
        "close": 84313000,
        "high": 84665000,
        "low": 83967000,
        "open": 84292000,
        "volume": 144.20590128
      },
      {
        "candle_date_time_kst": "2024-10-08T21:00:00",
        "close": 84339000,
        "high": 85270000,
        "low": 84000000,
        "open": 84621000,
        "volume": 435.17075718
      },
      {
        "candle_date_time_kst": "2024-10-08T17:00:00",
        "close": 84626000,
        "high": 84627000,
        "low": 84105000,
        "open": 84278000,
        "volume": 158.24283363
      },
      {
        "candle_date_time_kst": "2024-10-08T13:00:00",
        "close": 84278000,
        "high": 84616000,
        "low": 83900000,
        "open": 84486000,
        "volume": 276.53965226
      },
      {
        "candle_date_time_kst": "2024-10-08T09:00:00",
        "close": 84486000,
        "high": 84762000,
        "low": 83848000,
        "open": 83942000,
        "volume": 311.14340399
      },
      {
        "candle_date_time_kst": "2024-10-08T05:00:00",
        "close": 83942000,
        "high": 85335000,
        "low": 83884000,
        "open": 85175000,
        "volume": 359.28013773
      },
      {
        "candle_date_time_kst": "2024-10-08T01:00:00",
        "close": 85295000,
        "high": 85670000,
        "low": 84517000,
        "open": 85373000,
        "volume": 228.00091974
      },
      {
        "candle_date_time_kst": "2024-10-07T21:00:00",
        "close": 85373000,
        "high": 86301000,
        "low": 84496000,
        "open": 84893000,
        "volume": 693.11470008
      },
      {
        "candle_date_time_kst": "2024-10-07T17:00:00",
        "close": 84891000,
        "high": 85524000,
        "low": 84150000,
        "open": 85342000,
        "volume": 456.92161054
      },
      {
        "candle_date_time_kst": "2024-10-07T13:00:00",
        "close": 85342000,
        "high": 85550000,
        "low": 85150000,
        "open": 85330000,
        "volume": 253.72876726
      },
      {
        "candle_date_time_kst": "2024-10-07T09:00:00",
        "close": 85331000,
        "high": 85905000,
        "low": 84345000,
        "open": 84436000,
        "volume": 797.16878272
      },
      {
        "candle_date_time_kst": "2024-10-07T05:00:00",
        "close": 84533000,
        "high": 84630000,
        "low": 84103000,
        "open": 84400000,
        "volume": 165.8888936
      },
      {
        "candle_date_time_kst": "2024-10-07T01:00:00",
        "close": 84401000,
        "high": 84710000,
        "low": 84301000,
        "open": 84400000,
        "volume": 194.24270115
      },
      {
        "candle_date_time_kst": "2024-10-06T21:00:00",
        "close": 84400000,
        "high": 84500000,
        "low": 83821000,
        "open": 83853000,
        "volume": 284.07613681
      },
      {
        "candle_date_time_kst": "2024-10-06T17:00:00",
        "close": 83853000,
        "high": 83898000,
        "low": 83600000,
        "open": 83723000,
        "volume": 118.34398529
      },
      {
        "candle_date_time_kst": "2024-10-06T13:00:00",
        "close": 83723000,
        "high": 83821000,
        "low": 83600000,
        "open": 83714000,
        "volume": 82.80824412
      },
      {
        "candle_date_time_kst": "2024-10-06T09:00:00",
        "close": 83714000,
        "high": 84051000,
        "low": 83660000,
        "open": 83997000,
        "volume": 145.62874122
      },
      {
        "candle_date_time_kst": "2024-10-06T05:00:00",
        "close": 83956000,
        "high": 84010000,
        "low": 83511000,
        "open": 83652000,
        "volume": 93.83073713
      },
      {
        "candle_date_time_kst": "2024-10-06T01:00:00",
        "close": 83652000,
        "high": 84058000,
        "low": 83650000,
        "open": 84053000,
        "volume": 87.61453323
      },
      {
        "candle_date_time_kst": "2024-10-05T21:00:00",
        "close": 84047000,
        "high": 84190000,
        "low": 83959000,
        "open": 84020000,
        "volume": 113.53028808
      },
      {
        "candle_date_time_kst": "2024-10-05T17:00:00",
        "close": 84020000,
        "high": 84053000,
        "low": 83848000,
        "open": 83854000,
        "volume": 111.4479619
      },
      {
        "candle_date_time_kst": "2024-10-05T13:00:00",
        "close": 83854000,
        "high": 83977000,
        "low": 83634000,
        "open": 83780000,
        "volume": 118.84359713
      },
      {
        "candle_date_time_kst": "2024-10-05T09:00:00",
        "close": 83780000,
        "high": 84126000,
        "low": 83522000,
        "open": 83804000,
        "volume": 251.49820859
      },
      {
        "candle_date_time_kst": "2024-10-05T05:00:00",
        "close": 83805000,
        "high": 84300000,
        "low": 83719000,
        "open": 84187000,
        "volume": 198.79586109
      },
      {
        "candle_date_time_kst": "2024-10-05T01:00:00",
        "close": 84184000,
        "high": 84300000,
        "low": 83474000,
        "open": 83700000,
        "volume": 282.6800021
      },
      {
        "candle_date_time_kst": "2024-10-04T21:00:00",
        "close": 83700000,
        "high": 83850000,
        "low": 82671000,
        "open": 82866000,
        "volume": 838.55415486
      },
      {
        "candle_date_time_kst": "2024-10-04T17:00:00",
        "close": 82867000,
        "high": 82976000,
        "low": 82572000,
        "open": 82708000,
        "volume": 246.20261925
      },
      {
        "candle_date_time_kst": "2024-10-04T13:00:00",
        "close": 82741000,
        "high": 82801000,
        "low": 82330000,
        "open": 82478000,
        "volume": 251.2748227
      },
      {
        "candle_date_time_kst": "2024-10-04T09:00:00",
        "close": 82478000,
        "high": 82850000,
        "low": 82038000,
        "open": 82401000,
        "volume": 359.60101718
      },
      {
        "candle_date_time_kst": "2024-10-04T05:00:00",
        "close": 82424000,
        "high": 82513000,
        "low": 82085000,
        "open": 82473000,
        "volume": 158.74276642
      }
    ]
  },
  "chart_pattern": null,
  "master": {
    "decision": "HOLD",
    "percentage": 0,
    "summary": "투자 전문가들의 의견이 엇갈리고 있어, 현재로서는 명확한 투자 방향을 결정하기 어렵습니다. FNG 분석에서는 시장의 변동성이 증가하고 있으며, 투자자들이 신중한 태도로 전환하고 있음을 시사하여 'HOLD'를 권장하고 있습니다. 반면, 뉴스 검색에서는 영국 연금 펀드의 비트코인 투자 소식이 긍정적인 신호로 해석되어 'BUY'를 제안하고 있습니다. 그러나, 양적 분석에서는 기술적 지표들이 하락 신호를 보내고 있어 'SELL'을 권장하고 있습니다. 이러한 상반된 의견을 종합해 볼 때, 현재 시장의 불확실성이 크므로 추가적인 정보와 시장 변화를 주의 깊게 관찰하며 'HOLD' 전략을 유지하는 것이 바람직합니다. 투자 전문가들의 의견이 엇갈리고 있어, 현재로서는 명확한 투자 방향을 결정하기 어렵습니다. FNG 분석에서는 시장의 변동성이 증가하고 있으며, 투자자들이 신중한 태도로 전환하고 있음을 시사하여 'HOLD'를 권장하고 있습니다. 반면, 뉴스 검색에서는 영국 연금 펀드의 비트코인 투자 소식이 긍정적인 신호로 해석되어 'BUY'를 제안하고 있습니다. 그러나, 양적 분석에서는 기술적 지표들이 하락 신호를 보내고 있어 'SELL'을 권장하고 있습니다. 이러한 상반된 의견을 종합해 볼 때, 현재 시장의 불확실성이 크므로 추가적인 정보와 시장 변화를 주의 깊게 관찰하며 'HOLD' 전략을 유지하는 것이 바람직합니다. 반복) 투자 전문가들의 의견이 엇갈리고 있어, 현재로서는 명확한 투자 방향을 결정하기 어렵습니다. FNG 분석에서는 시장의 변동성이 증가하고 있으며, 투자자들이 신중한 태도로 전환하고 있음을 시사하여 'HOLD'를 권장하고 있습니다. 반면, 뉴스 검색에서는 영국 연금 펀드의 비트코인 투자 소식이 긍정적인 신호로 해석되어 'BUY'를 제안하고 있습니다. 그러나, 양적 분석에서는 기술적 지표들이 하락 신호를 보내고 있어 'SELL'을 권장하고 있습니다. 이러한 상반된 의견을 종합해 볼 때, 현재 시장의 불확실성이 크므로 추가적인 정보와 시장 변화를 주의 깊게 관찰하며 'HOLD' 전략을 유지하는 것이 바람직합니다. 투자 전문가들의 의견이 엇갈리고 있어, 현재로서는 명확한 투자 방향을 결정하기 어렵습니다. FNG 분석에서는 시장의 변동성이 증가하고 있으며, 투자자들이 신중한 태도로 전환하고 있음을 시사하여 'HOLD'를 권장하고 있습니다. 반면, 뉴스 검색에서는 영국 연금 펀드의 비트코인 투자 소식이 긍정적인 신호로 해석되어 'BUY'를 제안하고 있습니다. 그러나, 양적 분석에서는 기술적 지표들이 하락 신호를 보내고 있어 'SELL'을 권장하고 있습니다. 이러한 상반된 의견을 종합해 볼 때, 현재 시장의 불확실성이 크므로 추가적인 정보와 시장 변화를 주의 깊게 관찰하며 'HOLD' 전략을 유지하는 것이 바람직합니다."
  }
}

const AgentAI = () => {


  // const [data, setData] = useState(null);
  const [data, setData] = useState(fakeData);

  useEffect(()=> {

  },[]);

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetchData 호출됨");
      try {
        const response = await instance.post("http://3.35.238.247:8000/ai/analysis");
        setData(response.data);
        console.log(response.data);
      } catch(error){
        console.error("데이터 요청 오류: ", error);
      }
    }
    fetchData();
  }, [])

  return(
    <Container>
      <QuantAgent className="item"/>
      <PatternAgent className="item"/>
      <FngAgent className="item"/>
      <MasterAgent className="item" masterData={data.master}/>
      {data && <NewsAgent className="item" newsData={data.news_search} />}
    </Container>
  )
}

export default AgentAI;

const Container = styled.div`
  display: grid;
  grid-template-columns: 6fr 4fr 4fr 5fr;
  grid-template-rows: 200px 200px;
  gap: 30px;
  padding: 20px;

  .item:nth-child(1) {
    grid-column: 1 / span 1;
    grid-row: 1 / span 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: skyblue;
  }

  .item:nth-child(2) {
    grid-column: 2;
    grid-row: 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: skyblue;
  }

  .item:nth-child(3) {
    grid-column: 3;
    grid-row: 1;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: skyblue;
  }

  .item:nth-child(4) {
    grid-column: 4;
    grid-row: 1 / span 2;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background: linear-gradient(135deg, var(--trai-greytext), var(--trai-disabled));
  }

  .item:nth-child(5) {
    grid-column: 1 / span 3;
    grid-row: 2;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    padding: 20px;
    background-color: var(--trai-white);
  }
`