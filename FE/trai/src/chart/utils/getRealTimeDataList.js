import { useEffect, useRef, useState } from "react";

const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

const useRealTimeData = (setData) => {
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(UPBIT_URL);

    ws.current.onopen = () => {
      const message = [
        { ticket: "nexoneunji" },
        { type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true },
      ];
      ws.current.send(JSON.stringify(message));
    };

    ws.current.onmessage = async (event) => {
      const text = await new Response(event.data).text();
      const message = JSON.parse(text);
      const {
        opening_price,
        low_price,
        high_price,
        trade_price,
        timestamp,
        trade_volume,
      } = message;

      // 실시간 데이터 업데이트
      const newData = {
        open: opening_price,
        low: low_price,
        high: high_price,
        close: trade_price,
        volume: trade_volume,
        timestamp: Math.floor(timestamp / 60000) * 60000, // 1분 단위로 조정
      };

      setData(prevData => [...prevData, newData].slice(-720)); // 최신 720개의 데이터 유지
    };

    ws.current.onerror = (event) => {
      console.error("WebSocket error:", event);
      ws.current.close();
    };

    return () => {
      ws.current.close();
    };
  }, [setData]);
};

export default useRealTimeData;
