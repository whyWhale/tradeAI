import { useState, useEffect, useRef } from "react";
const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

const useRealTimeData = (initialized) => {
  const [result, setResult] = useState();
  //const [timer, setTimer] = useState(false);
  const ws = useRef(null);

  // useEffect(() => {
  //   // timer 종료 시 트리거
  //   if (timer) {
  //     alert("만료되었습니다.");
  //     ws.current.close();
  //   }
  // }, [timer]);

  useEffect(() => {
    if (!initialized) return; // 초기화가 완료되지 않았으면 연결하지 않음
    // // 10분 지나면 종료 처리
    // setTimeout(() => {
    //   setTimer(true);
    // }, 10 * 60 * 1000);

    ws.current = new WebSocket(UPBIT_URL);

    ws.current.onopen = () => {
      const message = [
        { ticket: "nexoneunji" },
        { type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true },
      ];
      ws.current.send(JSON.stringify(message));
    };

    ws.current.onclose = () => {
      console.log("DISCONNECTED");
    };

    ws.current.onmessage = async (event) => {
      const text = await new Response(event.data).text();
      const message = JSON.parse(text);
      console.log("Received message:", message); // 수신된 메시지 출력
      const {
        low_price,
        high_price,
        trade_price,
        timestamp,
        acc_trade_volume_24h,
        acc_trade_price_24h,
        change,
        signed_change_price,
        change_rate,            
      } = message;
      setResult({
        low: low_price,
        high: high_price,
        price: trade_price,
        tradeVolume: acc_trade_volume_24h,
        tradePrice: acc_trade_price_24h,
        change: change,
        changeRate: change_rate,
        changePrice: signed_change_price,
        timestamp:timestamp,
      });
    };

    ws.current.onerror = (event) => {
      console.log("Error", event);
      ws.current.close();
    };

    return () => {
      ws.current.close();
    };
  }, []);
  return result;
};

export default useRealTimeData;
