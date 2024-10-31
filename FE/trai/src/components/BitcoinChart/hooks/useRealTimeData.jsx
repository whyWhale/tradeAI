import { useState, useEffect, useRef } from "react";

const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

const useRealTimeData = () => {
  const [result, setResult] = useState(null);
  const [timer, setTimer] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    // 타이머 만료 시 WebSocket 종료
    if (timer) {
      alert("세션이 만료되었습니다.");
      if (ws.current) {
        ws.current.close();
      }
    }
  }, [timer]);

  const connectWebSocket = () => {
    ws.current = new WebSocket(UPBIT_URL);

    ws.current.onopen = () => {
      console.log("WebSocket 연결 성공");
      const message = [
        { ticket: "nexoneunji" },
        { type: "ticker", codes: ["KRW-BTC"], isOnlyRealtime: true },
      ];
      ws.current.send(JSON.stringify(message));
    };

    ws.current.onclose = () => {
      console.log("WebSocket 연결 종료");
      // 타이머 만료가 아닌 경우에만 재연결 시도
      if (!timer) {
        setTimeout(() => {
          console.log("WebSocket 재연결 시도");
          connectWebSocket();
        }, 5000); // 5초 후 재연결 시도
      }
    };

    ws.current.onmessage = async (event) => {
      const text = await new Response(event.data).text();
      const message = JSON.parse(text);
      console.log("Received message:", message);

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
        change,
        changeRate: change_rate,
        changePrice: signed_change_price,
        timestamp,
      });
    };

    ws.current.onerror = (event) => {
      console.log("WebSocket 오류 발생:", event);
      if (ws.current) {
        ws.current.close();
      }
    };
  };

  useEffect(() => {
    // WebSocket 연결 설정
    connectWebSocket();

    // 10분 타이머 설정 후 만료 처리
    const timeout = setTimeout(() => {
      setTimer(true);
    }, 10 * 60 * 1000);

    return () => {
      // 컴포넌트 언마운트 시 WebSocket 닫기 및 타이머 정리
      if (ws.current) {
        ws.current.close();
      }
      clearTimeout(timeout);
    };
  }, []);

  return result;
};

export default useRealTimeData;
