import { useState, useEffect, useRef } from "react";
import { updateBTCData } from '../../../store/reducers/BTCDataSlice';
import { useDispatch } from 'react-redux';

const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

function connect(ws, c, setResult, dispatch, uuid, isConnected) {
  if (c.current > 10 || isConnected.current) {
    return;
  }

  ws.current = new WebSocket(UPBIT_URL);
  ws.current.onopen = () => {
    isConnected.current = true; // 연결 성공
    c.current = 0; // 재연결 카운터 초기화
    const message = [
      { ticket: uuid },
      { type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true },
    ];
    ws.current.send(JSON.stringify(message));
  };

  ws.current.onclose = () => {
    isConnected.current = false; // 연결이 끊어지면 false
    if (c.current < 10) {
      c.current += 1;
      setTimeout(() => connect(ws, c, setResult, dispatch, uuid, isConnected), 2500 * c.current);
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

    const formattedResult = {
      low: low_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      high: high_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      price: trade_price.toLocaleString(),
      tradeVolume: acc_trade_volume_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      tradePrice: acc_trade_price_24h.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      change: change,
      changeRate: change_rate,
      changePrice: signed_change_price.toLocaleString(),
      timestamp: timestamp,
    };

    setResult(formattedResult);
    dispatch(updateBTCData(trade_price));
  };

  ws.current.onerror = () => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
    if (!isConnected.current && c.current < 10) { // 연결이 안된 상태에서만 재연결 시도
      c.current += 1;
      setTimeout(() => connect(ws, c, setResult, dispatch, uuid, isConnected), 2500 * c.current);
    }
  };
}

const useRealTimeData = (chartInitialized, uuid) => {
  const dispatch = useDispatch();
  const [result, setResult] = useState();
  const ws = useRef(null);
  const c = useRef(0);
  const isConnected = useRef(false); // 연결 상태를 추적

  useEffect(() => {
    if (!chartInitialized) return;

    connect(ws, c, setResult, dispatch, uuid, isConnected);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chartInitialized, dispatch, uuid]);

  return { result, getWebSocket: () => ws.current };
};

export default useRealTimeData;
