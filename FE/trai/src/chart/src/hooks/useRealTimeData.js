import { useEffect, useRef } from "react";

const UPBIT_URL = "wss://api.upbit.com/websocket/v1";

const useRealTimeData = (updateChartData) => {
  const ws = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      ws.current = new WebSocket(UPBIT_URL);

      ws.current.onopen = () => {
        console.log("WebSocket connection opened");
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

        // 실시간 데이터
        const newData = {
          time: Math.floor(timestamp / 60000) * 60000, // 1분 단위로 조정
          open: opening_price,
          low: low_price,
          high: high_price,
          close: trade_price,
          volume: trade_volume, // 수정된 변수명
        };

        // 차트 업데이트 함수 호출
        updateChartData(newData);
      };

      ws.current.onerror = (event) => {
        console.error("WebSocket error:", event);
        ws.current.close(); // 오류 발생 시 연결 종료
      };

      ws.current.onclose = () => {
        console.log("WebSocket connection closed, attempting to reconnect...");
        setTimeout(connectWebSocket, 1000); // 1초 후 재연결 시도
      };
    };

    connectWebSocket(); // WebSocket 연결 시도

    return () => {
      if (ws.current) {
        ws.current.close(); // 컴포넌트 언마운트 시 연결 종료
      }
    };
  }, [updateChartData]); // updateChartData가 변경될 때마다 재실행
};

export default useRealTimeData;
