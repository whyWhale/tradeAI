import React, { useState, useEffect, useRef } from "react";
import { init, dispose } from "klinecharts";
import { useDispatch } from "react-redux";

import Layout from "./Layout";
import "./chart.scss"; 
import getInitialDataList from "./utils/getInitialDataList";
import getInitialDetailList from "./utils/getInitialDetailList";
import getLanguageOption from "./utils/getLanguageOption";
import { chartStyle } from './chartStyle';
import useRealTimeData from "./hooks/useRealTimeData";
import useNewData from "./hooks/useNewData";
import ChartButton from './ChartButton';
import { updateBTCData } from "../../store/reducers/BTCDataSlice"

const types = [
  { key: "candle_solid", text: "solid" },
  { key: "candle_stroke", text: "stroke" },
  { key: "ohlc", text: "OHLC" },
  { key: "area", text: "Mountain" },
];

const CoinChart = () => {
  const chartRef = useRef(null);
  const [chartInitialized, setChartInitialized] = useState(false);
  const [priceInitialized, setPriceInitialized] = useState(false);
  const [activeType, setActiveType] = useState("candle_solid");
  const [chartDetail, setChartDetail] = useState(null); 

  const realTimeData = useRealTimeData(chartInitialized); // 초기화가 완료된 후에만 실행
  const newData = useNewData(1, priceInitialized); // 초기화가 완료된 후에만 실행
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

      try {
        while (!chartInitialized || !priceInitialized) {
          try {
            if (!chartInitialized) {  // 차트 데이터 초기화 전이라면 차트 데이터 요청
              const chartDataList = await getInitialDataList(1);
              if (chartRef.current) { // 제대로 받아왔다면
                chartRef.current.applyNewData(chartDataList);
                setChartInitialized(true);
              }
            }
      
            if (!priceInitialized) {  // 시세 정보 데이터 요청
              const detailDataList = await getInitialDetailList();
              if (detailDataList && detailDataList[0]) {  // 제대로 받아왔다면
                updateChartDetail(detailDataList[0]);
                dispatch(updateBTCData(detailDataList[0].price)); // Redux 스토어에 비트코인 가격 업데이트
                priceInitialized = true;
                setPriceInitialized(true); 
              }
            }
          } catch (error) {
            console.error("Failed to fetch data. Retrying in 1 second...", error);
          }
          // 아직 초기화가 완료되지 않았으면 1초 대기 후 재시도
          if (!chartInitialized || !priceInitialized) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
          }
        }
      }
      catch (error) {
        console.error("Failed to fetch initial chart data. Retrying in 10 seconds...", error);
        setTimeout(fetchData, 1000); // 1초 후에 다시 fetchData 호출
      }
    }

    fetchData();

    return () => {
      dispose("coin-chart");
    };
  }, []);

  useEffect(() => {
    if (newData) {      
      chartRef.current.updateData(newData); 
    }
  }, [newData]); 

  useEffect(() => {
    if (realTimeData) {
      updateChartDetail(realTimeData); 
    }
  }, [realTimeData]); 

  return (
    <>
      <div className="chart-header">
        {chartDetail ? (
          <>
            <div className="chart-price-container" style={ chartDetail.priceStyle }>
              <div className="chart-price">{`${formatValue(chartDetail.price)}`}<span  style={{  position: 'relative', top: '16px', fontSize: '16px' }}>KRW</span></div>
              <div className="change-text">
                <span className="signed-price-rate">{`${formatValue(chartDetail.changeRate)}`}</span>
                <span className="change-price">{`${formatValue(chartDetail.changePrice)}`}</span>
              </div>
            </div>
            <div className="chart-details">
              <div className="high">고가<br/><span className="high-value">{`${formatValue(chartDetail.high)} KRW`}</span></div>
              <div className="low">저가<br/><span className="low-value">{`${formatValue(chartDetail.low)} KRW`}</span></div>
              <div className="volume24">거래량(24h)<br/><span className="volume24-value">{`${formatValue(chartDetail.tradeVolume)} KRW`}</span></div>
              <div className="price24">거래대금(24H)<br/><span className="price24-value">{`${formatValue(chartDetail.tradePrice)} KRW`}</span></div>
            </div>
          </>
        ) : (
          <div class="loader">&nbsp;&nbsp;&nbsp;시세&nbsp;정보를<br/>불러오는&nbsp;중입니다.</div>
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