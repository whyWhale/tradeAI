import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";

import Layout from "../Layout";
import "./chart.scss"; 
import useNewData from "../hooks/useNewData";
import getInitialDataList from "../utils/getInitialDataList";
import getLanguageOption from "../utils/getLanguageOption";
import { chartStyle } from './chartStyle';
import bitcoinIcon from './BC_Logo_.png';
import useRealTimeData from "../hooks/useRealTimeData";

const types = [
  { key: "candle_solid", text: "캔들" },
  { key: "candle_stroke", text: "투명 캔들" },
  { key: "ohlc", text: "Bar 형식의 OHLC" },
  { key: "area", text: "Mountain" },
];

const CoinChart = () => {
  const chartRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const newData = useNewData(1); // newData 가져오기
  const realTimeData = useRealTimeData(); // useRealTimeData 호출

  // realTimeData가 null일 경우를 처리
  const price = realTimeData ? realTimeData.price : null;
  const high = realTimeData ? realTimeData.high : null;
  const low = realTimeData ? realTimeData.low : null;
  const volume = realTimeData ? realTimeData.volume : null;

  useEffect(() => {
    // 차트 초기화
    chartRef.current = init("coin-chart"); 
    // 기본 스타일 옵션 설정
    chartRef.current.setStyleOptions({
      ...getLanguageOption(),
      ...chartStyle
    });

    const fetchData = async () => {
      const dataList = await getInitialDataList(1);
      chartRef.current.applyNewData(dataList); // 초기 데이터 적용
      setInitialized(true); // 초기화 완료 플래그 설정
    };

    fetchData();

    return () => {
      dispose("coin-chart"); // 컴포넌트 언마운트 시 차트 정리
    };
  }, []);

  useEffect(() => {
    if (initialized) {      
      chartRef.current.updateData(newData); // 차트 업데이트
    }
  }, [newData, initialized]); // newData와 initialized가 변경될 때마다 실행

  return (
    <div className="chart-container">
      <Layout ticker={
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <img src={bitcoinIcon} alt="Bitcoin Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
            <span>비트코인 BITCOIN</span>
          </div>
      }>
        <div className="chart-header">
          {price !== null && high !== null && low !== null && volume !== null ? (
            <>
              <div className="chart-price">{`${price.toLocaleString()} KRW`}</div>
              <div className="change-text">+0.14%</div>
              <div className="chart-details">
                <div>고가: {`${high.toLocaleString()} KRW`}</div>
                <div>저가: {`${low.toLocaleString()} KRW`}</div>
                <div>거래량: {`${volume.toLocaleString()}`}</div>
              </div>
            </>
          ) : (
            <div>Loading...</div> // 데이터 로딩 중 메시지
          )}
        </div>
        <div id="coin-chart" className="coin-chart" />
        <div className="chart-menu-container">
          {types.map(({ key, text }) => (
            <button
              key={key}
              onClick={() => {
                // 버튼 클릭 시 차트 유형만 변경
                chartRef.current.setStyleOptions({ 
                  candle: { 
                    type: key 
                  }
                });
              }}
            >
              {text}
            </button>
          ))}
        </div>
      </Layout>
    </div>
  );
};

export default CoinChart;
