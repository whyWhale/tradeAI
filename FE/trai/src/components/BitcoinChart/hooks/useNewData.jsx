import { useState, useEffect } from "react";
import axios from "axios";

const useNewData = (unit, priceInitialized) => {
  const [newData, setNewData] = useState(null); // newData 상태
  const [lastFetchTime, setLastFetchTime] = useState(0); // lastFetchTime 상태 추가

  useEffect(() => {
    if (!priceInitialized) return; // 초기화가 완료되지 않았으면 연결하지 않음

    const fetchData = async () => {
      const currentTime = Date.now();

      // 10초 간격으로 요청
      if (currentTime - lastFetchTime >= 10000) {
        try {
          const response = await axios.get(`https://api.upbit.com/v1/candles/minutes/${unit}`, {
            params: {
              market: 'KRW-BTC',
              count: 1 // 가장 최근 캔들 가져옴
            }
          });

          const data = response.data[0]; // 배열에서 첫 번째 요소만 가져옴
          if (data) {
            const { opening_price, low_price, high_price, trade_price, timestamp, candle_acc_trade_volume } = data;
            const formattedData = {
              open: opening_price,
              low: low_price,
              high: high_price,
              close: trade_price,
              volume: candle_acc_trade_volume,
              // 분 단위로 timestamp 조정
              timestamp: Math.floor(timestamp / 60000) * 60000, // 1분 단위로 조정
              turnover: (opening_price + low_price + high_price + trade_price) / 4 * candle_acc_trade_volume
            };
            setNewData(formattedData); // newData 상태 업데이트
            setLastFetchTime(currentTime); // 마지막 요청 시간 업데이트
          }

        } catch (error) {
          console.error(error);
          setNewData(null); // 에러 발생 시 상태를 null로 설정
        }
      } else {
        console.log('10초 이내에 요청이 발생했습니다. 대기 중...');
      }
    };

    fetchData(); // 데이터 가져오기

    // interval을 설정하여 주기적으로 fetchData 호출
    const interval = setInterval(fetchData, 10000);
    // cleanup function
    return () => clearInterval(interval); // 컴포넌트가 언마운트될 때 interval 정리
  }, [priceInitialized]);

  return newData; // 단일 캔들 데이터 반환
};

export default useNewData;
