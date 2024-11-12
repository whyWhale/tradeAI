import { useState, useEffect, useRef } from "react";
const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

const useRealTimeData = (chartInitialized) => {
  const [result, setResult] = useState();
  const ws = useRef(null);

  useEffect(() => {
    if (!chartInitialized) return; // 초기화가 완료되지 않았으면 연결하지 않음

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
        low: low_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        high: high_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        price: trade_price.toLocaleString(),
        tradeVolume: acc_trade_volume_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        tradePrice: acc_trade_price_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        change: change,
        changeRate: change_rate,
        changePrice: signed_change_price.toLocaleString(),
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
  }, [chartInitialized]);
  return result;
};

export default useRealTimeData;
