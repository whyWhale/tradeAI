import axios from "axios";

const getInitialDataList = (unit) => {
  return axios.get(`https://www.trai-ai.site/api/upbit/candles/minutes/${unit}`, {
      params: {
      market: 'KRW-BTC',
      to: new Date(+new Date() + 200*60 * 10000).toISOString().replace("T", " ").replace(/\..*/, ''),
      count: 200  // 캔들 최대 200개까지 받을 수 있음
    }
  })
      .then(res => res.data)
      .then((data) => {
        return data.map((item) => {
          const { opening_price, low_price, high_price, trade_price, timestamp, candle_acc_trade_volume } = item;
          return {
            open: opening_price,
            low: low_price,
            high: high_price,
            close: trade_price,
            volume: candle_acc_trade_volume,
            // 분 단위로 timestamp 조정
            timestamp: Math.floor(timestamp / 60000) * 60000, // 1분 단위로 조정
            turnover: (opening_price + low_price + high_price + trade_price) / 4 * candle_acc_trade_volume
          };
        });
      })
      .then((arr) => arr.reverse()) // 차트 데이터는 가장 오래된 데이터부터 최신 데이터 순으로 정렬
      .catch(err => {
        console.error(err);
        return []; // 에러 발생 시 빈 배열 반환
      });
}


export default getInitialDataList;