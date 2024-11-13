import React from 'react';

import NavBar from '@components/NavBar';
import './index.scss';
import DecisionStatusChart from  '../../components/DonutChart/decisionStatusChart.jsx';
import CoinChart from '../../components/BitcoinChart/CoinChart.jsx';
import Timeline from '../../components/Timeline/index.jsx';
import bitcoinIcon from '../../components/BitcoinChart/BC_Logo.png';
import useAssetData from './apis/useAssetData.jsx'
import { useSelector } from 'react-redux';
import useInvestmentSummary from './apis/useInvestmentSummary.jsx';
import '../../components/Loaders/index.scss'

const AssetOverview = () => {
  const BTCData = useSelector((state) => state.BTCData);
  const { assetData, assetLoading, assetEmpty, assetError } = useAssetData();
  const { investmentData, tradeInitialized, investmentLoading, investmentError } = useInvestmentSummary();

  const decisionCount = useSelector((state) => state.decisionCount.totalCount);
  return (
    <div className="asset-overview">
      {/* Left Sidebar */}
      <aside className="navbar">
        <NavBar />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Info Cards */}
          <>
            <div className="info-card-small card1">
              <div className="card-title">총 보유 자산</div>
              <div style={{ fontSize: "18px" }}>
                <span>{assetLoading || assetError ? "?" : (assetEmpty ? "자산 정보가 없습니다." : `${assetData.totalAssets} KRW`)}</span>
                <span style={{ float: "right", color: "#48BB78" }}>{assetLoading ||assetError? " ? " :(assetEmpty ? "자산 정보가 없습니다." : `${assetData.returnRate}`)} %</span>
              </div>
            </div>

            <div className="info-card-small card2">
              <div className="card-title">총 매수</div>
              <div style={{ fontSize: "12px" }}>{assetLoading ||assetError ? " ? " :(assetEmpty ? "자산 정보가 없습니다." : `${assetData.totalPurchase}`)} KRW</div>
              <div className="card-title">총 평가</div>
              <div style={{ fontSize: "12px" }}>{assetLoading ||assetError ? " ? " : (assetEmpty ? "자산 정보가 없습니다." :`${assetData.totalValuation}`)} KRW</div>
            </div>

            <div className="info-card-small card3">
              <div className="card-title">보유 KRW</div>
              <div style={{ fontSize: "12px" }}>{assetLoading||assetError ? " ? " : (assetEmpty ? "자산 정보가 없습니다." :`${assetData.heldKRW}`)}</div>
              <div className="card-title">주문가능금액</div>
              <div style={{ fontSize: "12px" }}>{assetLoading||assetError ? " ? " : (assetEmpty ? "자산 정보가 없습니다." :`${assetData.heldKRW}`)} KRW</div>
            </div>

            <div className="info-card-small card4">
              <div className="card-title">평가 손익</div>
              <div style={{ fontSize: "18px" }}>
                <span>{assetLoading||assetError ? " ? " : (assetEmpty ? "자산 정보가 없습니다." :`${assetData.valuationProfit}`)} KRW</span>
                <span style={{ float: "right", color: "#48BB78" }}>{assetLoading||assetError ? " ? " :(assetEmpty ? "자산 정보가 없습니다." : `${assetData.valuationProfitRatio}`)} %</span>
              </div>
            </div>
          </>
        {/* Right Side Info Cards */}
        <div className="info-card-medium">
          <div className="card-title" style={{
            position: 'absolute',
            top: '2.5%',
            left: '5%',      
            paddingBottom: "5%"}}>투자 요약</div>
          
          <>
          { investmentLoading || investmentError ?
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
              <div className="spinner"></div>
            </div>
          : 
            <div className='card-content'>
              {tradeInitialized === false ? <div> &nbsp;&nbsp;&nbsp;투자가 아직 시작되지 않았습니다. </div> :
                <>
                  <div>누적 수익률</div>
                  <div style={{ fontSize: "17px" }}>{`${investmentData.returnRate}`} %</div>
                  <div>총 거래 횟수</div>
                  <div style={{ fontSize: "17px" }}>{`${investmentData.totalTransactionCount}`}</div>
                  <div>첫 거래 날짜</div>
                  <div style={{ color: "#A0AEC0" }}>{`${investmentData.firstTransactionTime}`}</div>
                  <div>마지막 거래 날짜</div>
                  <div style={{ color: "#A0AEC0" }}>{`${investmentData.lastTransactionTime}`}</div>
                </>
              }
            </div>
          }
          </>
        </div>
        
        <div className="info-card-large">
          <div className="card-title">최근 거래 {decisionCount}회 의사결정 현황</div>
            <DecisionStatusChart />
        </div>

        {/* Bottom Chart and Sidebar */}
        <div className="chart">
          <div className="ticker">
            <img src={bitcoinIcon} alt="Bitcoin Icon" style={{ width: '24px', height: '24px', marginRight: '8px', marginTop: '10px' }} />
            <span>비트코인 </span>
            <span style={{  position: 'relative', top: '10px', fontSize: '16px' }}>&nbsp;BTC/KRW</span>
          </div>
          <CoinChart/>
        </div>
        
        <div className="sidebar">
          <div className="card-title" style={{
            position: 'absolute',
            top: '2.5%',
            left: '5%',      
            paddingBottom: "5%"}}>투자 내역</div>
          <Timeline/>
        </div>
      </div>
    </div>
  );
};

export default AssetOverview;