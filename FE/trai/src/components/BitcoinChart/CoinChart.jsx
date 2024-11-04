import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";

import Layout from "./Layout";
import "./chart.scss"; 
import getInitialDataList from "./utils/getInitialDataList";
import getInitialDetailList from "./utils/getInitialDetailList";
import getLanguageOption from "./utils/getLanguageOption";
import { chartStyle } from './chartStyle';
import bitcoinIcon from './BC_Logo.png';
import useRealTimeData from "./hooks/useRealTimeData";
import useNewData from "./hooks/useNewData";
import ChartButton from './ChartButton'

const types = [
  { key: "candle_solid", text: "solid" },
  { key: "candle_stroke", text: "stroke" },
  { key: "ohlc", text: "OHLC" },
  { key: "area", text: "Mountain" },
];

const CoinChart = () => {
  const chartRef = useRef(null);
  const [initialized, setInitialized] = useState(false);
  const [activeType, setActiveType] = useState("candle_solid"); // 현재 활성화된 차트 유형 상태
  const realTimeData = useRealTimeData(); // chart detail용 데이터
  const newData = useNewData(1); // chart용 데이터 가져오기
  const [chartDetail, setChartDetail] = useState(null); // chartDetail을 상태로 관리

  const formatValue = (value) => (value !== null && value !== undefined ? value.toLocaleString() : "0");

  const updateChartDetail = (data) => {
    setChartDetail({
        price: data.price,
        high: data.high,
        low: data.low,
        tradeVolume: data.tradeVolume,
        tradePrice: data.tradePrice,
        changeRate: `${(data.changeRate * 100).toFixed(2)}%`,
        changePrice: `${data.change === "RISE" ? "▲" : data.change === "FALL" ? "▼" : ""}${data.changePrice}`,
        priceStyle: {
            color: data.change === "RISE" ? "#F13B3B" : data.change === "FALL" ? "#3030FD" : "#CBD5E0"
        }
    });
  };

  useEffect(() => {
    chartRef.current = init("coin-chart"); 
    chartRef.current.setStyleOptions({
      ...getLanguageOption(),
      ...chartStyle
    });

    const fetchData = async () => {
      // 차트 데이터 요청
      const chartDataList = await getInitialDataList(1);
      if (chartRef.current) {
        chartRef.current.applyNewData(chartDataList); // 초기 데이터 적용
      }
  
      //  // 시세 정보 데이터 요청
      setTimeout(async () => {
        const detailDataList = await getInitialDetailList();
        if (detailDataList && detailDataList[0]) {
          updateChartDetail(detailDataList[0]);
        }
        setInitialized(true); // 초기화 완료
      }, 10000); // 10초 지연 (10,000밀리초)
    };
  
    fetchData();

    return () => {
      dispose("coin-chart");
    };
  }, []);



  useEffect(() => {
    if (initialized && newData) {      
      chartRef.current.updateData(newData); // 차트 업데이트
    }
  }, [newData, initialized]); // newData와 initialized가 변경될 때마다 실행

  useEffect(() => {
    if (realTimeData) {
      updateChartDetail(realTimeData); // 실시간 데이터로 chartDetail 업데이트
    }
  }, [realTimeData]);// realTimeData 변경될 때마다 실행


  return (
    <>
    <div className="chart-header">
      <div className="ticker">
        <img src={bitcoinIcon} alt="Bitcoin Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
        <span>비트코인 </span>
        <span style={{ fontSize: '16px' }}>&nbsp;BTC/KRW</span>
      </div>
      {chartDetail ? (
        <>
          <div className="chart-price-container" style={ chartDetail.priceStyle }>
            <div className="chart-price">{`${formatValue(chartDetail.price)}`}<span style={{ fontSize: '16px' }}>KRW</span></div>
            <div className="change-text">
              <span className="signed-price-rate">{`${formatValue(chartDetail.changeRate)}`}</span>
              <span className="change-price">{`${formatValue(chartDetail.changePrice)}`}</span>
            </div>
          </div>
          <div className="chart-details">
            <div className="high">고가&nbsp;<span className="high-value">{`${formatValue(chartDetail.high)} KRW`}</span></div>
            <div className="low">저가&nbsp;<span className="low-value">{`${formatValue(chartDetail.low)} KRW`}</span></div>
            <div className="volume24">거래량(24h)&nbsp;<span className="volume24-value">{`${formatValue(chartDetail.tradeVolume)}`}</span></div>
            <div className="price24">거래대금(24H)&nbsp;<span className="price24-value">{`${formatValue(chartDetail.tradePrice)}`}</span></div>
          </div>
        </>
      ) : (
        <div>Loading...</div>
      )}
    </div>
    <Layout>
      <div id="coin-chart" className="coin-chart" />
      <div className="chart-menu-container">
        {types.map(({ key, text }) => (
          <ChartButton
            key={key}
            className={activeType === key ? 'active' : ''}
            onClick={() => {
              setActiveType(key); // 클릭된 버튼을 active로 설정
              chartRef.current.setStyleOptions({ 
                candle: { 
                  type: key 
                }
              });
            }}
          >
            {text}
          </ChartButton>
        ))}
      </div>
    </Layout>
    </>
  );
};

export default CoinChart;
