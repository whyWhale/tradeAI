import axios from "axios";

const getInitialDetailList = (unit) => {
  return axios.get(`https://api.upbit.com/v1/ticker`, { 
    params: {
        markets: "KRW-BTC",
    }
  })
    .then(res => res.data)
    .then((data) => {
      return data.map((item) => {
        const {   low_price,
            high_price,
            trade_price,
            timestamp,
            acc_trade_volume_24h,
            acc_trade_price_24h,
            change,
            signed_change_price,
            change_rate } = item;
        return {
            low: low_price,
            high: high_price,
            price: trade_price,
            tradeVolume: acc_trade_volume_24h,
            tradePrice: acc_trade_price_24h,
            change: change,
            changeRate: change_rate,
            changePrice: signed_change_price,
            timestamp:timestamp,
        };
      });
    })
    .then((arr) => arr.reverse()) // 차트 데이터는 가장 오래된 데이터부터 최신 데이터 순으로 정렬
    .catch(err => {
      console.error(err);
      return []; // 에러 발생 시 빈 배열 반환
    });
}


export default getInitialDetailList;
