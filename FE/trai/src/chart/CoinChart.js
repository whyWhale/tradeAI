import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";

import Layout from "../Layout";
import useNewData from "../hooks/useNewData";
import getInitialDataList from "../utils/getInitialDataList";
import getLanguageOption from "../utils/getLanguageOption";
import { chartStyle } from './chartStyle';


const types = [
  { key: "candle_solid", text: "캔들" },
  { key: "candle_stroke", text: "투명 캔들" },
  { key: "ohlc", text: "Bar 형식의 OHLC" },
  { key: "area", text: "Mountain" },
];

const CoinChart = () => {
  const chartRef = useRef(null); // 차트 인스턴스를 저장할 ref
  const [initialized, setInitialized] = useState(false);
  const newData = useNewData();

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
      console.log("Updating chart with data", newData); // 데이터 확인

      chartRef.current.updateData(newData); // 차트 업데이트
    }
  }, [newData, initialized]); // newData와 initialized가 변경될 때마다 실행

  return (
    <Layout ticker="Bitcoin(BTC-KRW) 실시간 가격 조회">
      <div id="coin-chart" className="coin-chart" />
      <div className="chart-menu-container">
        {types.map(({ key, text }) => {
          return (
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
          );
        })}
      </div>
    </Layout>
  );
};

export default CoinChart;
