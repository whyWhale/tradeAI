import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";

import Layout from "./Layout";
import "./chart.scss"; 
import getInitialDataList from "./utils/getInitialDataList";
import getLanguageOption from "./utils/getLanguageOption";
import { chartStyle } from './chartStyle';
import bitcoinIcon from './BC_Logo.png';
import useRealTimeData from "./hooks/useRealTimeData";
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
  const realTimeData = useRealTimeData();

  const price = realTimeData ? realTimeData.price : null;
  const high = realTimeData ? realTimeData.high : null;
  const low = realTimeData ? realTimeData.low : null;
  const tradeVolume = realTimeData ? realTimeData.tradeVolume : null;
  const tradePrice = realTimeData ? realTimeData.tradePrice : null;
  const changeRate = realTimeData ? `${(realTimeData.changeRate * 100).toFixed(2)}%` : null;
  const changePrice = realTimeData ? `${(realTimeData.change==="RISE"?"▲":(realTimeData.change==="FALL"?"▼":""))}${realTimeData.changePrice}`: null;
  const formatValue = (value) => (value !== null && value !== undefined ? value.toLocaleString() : "0");

  useEffect(() => {
    chartRef.current = init("coin-chart"); 
    chartRef.current.setStyleOptions({
      ...getLanguageOption(),
      ...chartStyle
    });

    const fetchData = async () => {
      const dataList = await getInitialDataList(1);
      chartRef.current.applyNewData(dataList);
      setInitialized(true);
    };

    fetchData();

    return () => {
      dispose("coin-chart");
    };
  }, []);

  return (
    <>
    <div className="chart-header">
      <div className="ticker">
        <img src={bitcoinIcon} alt="Bitcoin Icon" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
        <span>비트코인 </span>
        <span style={{ fontSize: '16px' }}>&nbsp;BTC/KRW</span>
      </div>
      {price !== null && high !== null && low !== null && tradeVolume !== null && tradePrice !== null && changePrice !== null && changeRate !== null ? (
        <>
          <div className="chart-price-container">
            <div className="chart-price">{`${formatValue(price)}`}<span style={{ fontSize: '16px' }}>KRW</span></div>
            <div className="change-text">
              <span className="signed-price-rate">{`${formatValue(changeRate)}`}</span>
              <span className="change-price">{`${formatValue(changePrice)}`}</span>
            </div>
          </div>
          <div className="chart-details">
            <div className="high">고가&nbsp;<span className="high-value">{`${formatValue(high)} KRW`}</span></div>
            <div className="low">저가&nbsp;<span className="low-value">{`${formatValue(low)} KRW`}</span></div>
            <div className="volume24">거래량(24h)&nbsp;<span className="volume24-value">{`${formatValue(tradeVolume)}`}</span></div>
            <div className="price24">거래대금(24H)&nbsp;<span className="price24-value">{`${formatValue(tradePrice)}`}</span></div>
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
