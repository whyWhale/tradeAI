import { useState, useEffect, useRef } from "react";
const UPBIT_URL = "wss://api.upbit.com/websocket/v1";
function connect(ws, c, setResult) {
  ws.current = new WebSocket(UPBIT_URL);

  ws.current.onopen = () => {
    c.current = 0;
    const message = [
      {ticket: "nexoneunji"},
      {type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true},
    ];
    ws.current.send(JSON.stringify(message));
  };

  ws.current.onclose = () => {
    if (c.current < 15) {
      c.current += 1;
      setTimeout(() => connect(ws, c, setResult), 1000 * c.current);
    } else {
      c.current=10;
    }
  };

  ws.current.onmessage = async (event) => {
    const text = await new Response(event.data).text();
    const message = JSON.parse(text);
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
      low: low_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
      high: high_price.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
      price: trade_price.toLocaleString(),
      tradeVolume: acc_trade_volume_24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
      tradePrice: acc_trade_price_24h.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2}),
      change: change,
      changeRate: change_rate,
      changePrice: signed_change_price.toLocaleString(),
      timestamp: timestamp,
    });
  };

  ws.current.onerror = (event) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }

    setTimeout(() => connect(ws, c, setResult), 1000 * c.current);
  };
}

const useRealTimeData = (chartInitialized) => {
  const [result, setResult] = useState();
  const ws = useRef(null);
  const c = useRef(0)

  useEffect(() => {
    if (!chartInitialized) return; // 초기화가 완료되지 않았으면 연결하지 않음

    connect(ws, c, setResult);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chartInitialized]);
  return result;
};

export default useRealTimeData;
