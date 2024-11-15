import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";
import { useDispatch } from "react-redux";

import Layout from "./Layout";
import "./chart.scss"; 
import getInitialDataList from "./utils/getInitialDataList";
import getLanguageOption from "./utils/getLanguageOption";
import { chartStyle } from './chartStyle';
import useRealTimeData from "./hooks/useRealTimeData";
import ChartButton from './ChartButton';
import { updateBTCData } from "../../store/reducers/BTCDataSlice"
import { v4 as uuidv4 } from 'uuid';

const types = [
  { key: "candle_solid", text: "solid" },
  { key: "candle_stroke", text: "stroke" },
  { key: "ohlc", text: "OHLC" },
  { key: "area", text: "Mountain" },
];

const CoinChart = () => {
  const chartRef = useRef(null);
  const [chartInitialized, setChartInitialized] = useState(false);
  const [activeType, setActiveType] = useState("candle_solid");
  const [chartDetail, setChartDetail] = useState(null); 
  const [currentCandle, setCurrentCandle] = useState(null);
  const lastTimestampRef = useRef(null); // 마지막 캔들의 타임스탬프를 저장
  const uuid = useRef(uuidv4()); // 고정된 uuid 생성

  const realTimeData = useRealTimeData(chartInitialized, uuid.current); // 초기화가 완료된 후에만 실행
  const dispatch = useDispatch(); // Redux dispatch 함수 정의

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
        color: data.change === "RISE" ? "#EB5757" : data.change === "FALL" ? "#2D9CDB" : "#CBD5E0"
      }
    });
  };

  const updateCandle = (data) => {
    // 1분 단위 타임스탬프
    const timestamp = Math.floor(data.timestamp / 60000) * 60000;
  
    if (!lastTimestampRef.current || lastTimestampRef.current === timestamp) {
      // 현재 캔들을 업데이트
      setCurrentCandle((prevCandle) => {
        if (!prevCandle) {
          return {
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            timestamp: timestamp,
            tradePrice: data.tradePrice,
            tradeVolume: data.tradeVolume,
          };
        }
  
        return {
          ...prevCandle,
          high: Math.max(prevCandle.high, data.high),
          low: Math.min(prevCandle.low, data.low),
          close: data.close,
          tradeVolume: prevCandle.tradeVolume + data.tradeVolume,
        };
      });
    } else {
      // 1분이 지나면 새로운 캔들 생성
      const newCandle = {
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close,
        timestamp: timestamp,
        tradePrice: data.tradePrice,
        tradeVolume: data.tradeVolume,
      };
  
      // 완료된 이전 캔들을 차트에 추가
      chartRef.current.applyMoreData([currentCandle]); // prevCandle 대신 currentCandle 사용
  
      // 현재 캔들을 새로운 캔들로 교체
      setCurrentCandle(newCandle);
  
      // 마지막 타임스탬프 갱신
      lastTimestampRef.current = timestamp;
    }
  };
  

  
  useEffect(() => {
    const initChart = async () => {
      if (!chartInitialized) {
        try {
          chartRef.current = init("coin-chart");
          chartRef.current.setStyleOptions({
            ...getLanguageOption(),
            ...chartStyle,
          });
          const chartDataList = await getInitialDataList(1);
          if (chartRef.current && chartDataList && chartDataList[0]) {
            
            chartRef.current.applyNewData(chartDataList);
            setChartInitialized(true);
            updateChartDetail(chartDataList[0]);
            if(chartDataList[0].price!==undefined){
              dispatch(updateBTCData(chartDataList[0].price));
            }
          }
        } catch (error) {
          console.error("Failed to initialize chart data.", error);
        }
      }
    };
  
    initChart();
    
    return () => {
      // 언마운트될 때 dispose 호출
      if (chartRef.current) {
        console.log("dispose 호출");
        dispose("coin-chart");
        chartRef.current = null;
      }
    };
  }, []);
  
  const handleResize = () => {
    if (chartRef.current) {
      chartRef.current.resize(chartRef.current.clientWidth, chartRef.current.clientHeight);
    }
  };

  window.addEventListener("resize", handleResize);

  useEffect(() => {
    if (realTimeData) {
      updateChartDetail(realTimeData);
      updateCandle(realTimeData);
    }
  }, [realTimeData]);
  
  return (
    <>
      <div className="chart-header">
      {(chartInitialized && chartDetail?.price && parseInt(chartDetail?.price, 10) !== 0) ? (
          <>
            <div className="chart-price-container" style={ chartDetail.priceStyle }>
              <div className="chart-price">{`${formatValue(chartDetail.price)}`}<span  style={{  position: 'relative', top: '1.14vw', fontSize: '1.14vw' }}>KRW</span></div>
              <div className="change-text">
                <span className="signed-price-rate">{`${formatValue(chartDetail.changeRate)}`}</span>
                <span className="change-price">{`${formatValue(chartDetail.changePrice)}`}</span>
              </div>
            </div>
            <div className="chart-details">
              <div className="high">고가<br/><span className="high-value">{`${chartDetail.high} KRW`}</span></div>
              <div className="low">저가<br/><span className="low-value">{`${chartDetail.low} KRW`}</span></div>
              <div className="volume24">거래량(24H)<br/><span className="volume24-value">{`${formatValue(chartDetail.tradeVolume)} BTC`}</span></div>
              <div className="price24">거래대금(24H)<br/><span className="price24-value">{`${formatValue(chartDetail.tradePrice)} KRW`}</span></div>
            </div>
          </>
        ) : (
          <div className="loader">&nbsp;&nbsp;&nbsp;시세&nbsp;정보를<br/>불러오는&nbsp;중입니다.</div>
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
                setActiveType(key); 
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