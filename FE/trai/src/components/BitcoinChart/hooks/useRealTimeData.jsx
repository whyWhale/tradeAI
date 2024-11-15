import { useState, useEffect, useRef } from "react";
import { updateBTCData } from '../../../store/reducers/BTCDataSlice';
import { useDispatch } from 'react-redux';

const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

function connect(ws, c, setResult, dispatch, uuid) {
  if (c.current > 10) {
    return;
  }

  ws.current = new WebSocket(UPBIT_URL);
  ws.current.onopen = () => {
    c.current = 0;
    const message = [
      { ticket: uuid },
      { type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true },
    ];
    ws.current.send(JSON.stringify(message));
  };

  ws.current.onclose = () => {
    if (c.current < 10) {
      c.current += 1;
      setTimeout(() => connect(ws, c, setResult, dispatch), 2500 * c.current);
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
    
    // Redux 스토어에 trade_price 업데이트
    dispatch(updateBTCData(trade_price));
  };

  ws.current.onerror = (event) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.close();
    }
    if (c.current < 10) {
      c.current += 1;
      setTimeout(() => connect(ws, c, setResult, dispatch), 2500 * c.current);
    }
  };
}

const useRealTimeData = (chartInitialized, uuid) => {
  const dispatch = useDispatch();

  const [result, setResult] = useState();
  const ws = useRef(null);
  const c = useRef(0);
  const getWebSocket = () => ws.current;

  useEffect(() => {
    if (!chartInitialized) return; // 초기화가 완료되지 않았으면 연결하지 않음

    connect(ws, c, setResult, dispatch, uuid); // dispatch 전달

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [chartInitialized, dispatch]);

  return {result, getWebSocket};
};

export default useRealTimeData;
