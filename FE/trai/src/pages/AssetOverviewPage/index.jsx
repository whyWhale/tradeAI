import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import NavBar from '@components/NavBar';
import './index.scss';
import DecisionStatusChart from '../../components/DonutChart/decisionStatusChart.jsx';
import CoinChart from '../../components/BitcoinChart/CoinChart.jsx';
import Timeline from '../../components/Timeline/index.jsx';
import bitcoinIcon from '../../components/BitcoinChart/BC_Logo.png';
import useAssetData from './apis/useAssetData.jsx';
import useInvestmentSummary from './apis/useInvestmentSummary.jsx';
import useRealTimeAssetValue from './apis/useRealTimeAssetValue.jsx';
import '../../components/Loaders/index.scss';

const AssetOverview = () => {
  const BTCPrice = useSelector((state) => state.BTCData);
  const { assetData: initialAssetData, assetLoading, assetEmpty, assetError } = useAssetData();
  const { investmentData, tradeInitialized, investmentLoading, investmentError } = useInvestmentSummary();

  // 실제 업데이트된 assetData를 상태로 관리
  const [assetData, setAssetData] = useState(null);

  useEffect(() => {
    if (initialAssetData && BTCPrice !== null) {
      // BTCPrice와 initialAssetData를 기반으로 계산된 새로운 데이터를 설정
      const updatedAssetData = useRealTimeAssetValue(BTCPrice, initialAssetData);
      setAssetData(updatedAssetData);
    }
  }, [BTCPrice, initialAssetData]);

  const decisionCount = useSelector((state) => state.decisionCount.totalCount);   

  return (
    <div className='flex bg-trai-background min-h-screen' style={{ width: '100vw', height: '100vh' }}>
      <div className="asset-overview">
        <aside className="navbar">
          <NavBar />
        </aside>

        <div className="main-content">
          {assetLoading || assetData === null ? (
            <div>Loading...</div> // 로딩 상태를 표시
          ) : (
            <>
              <div className="info-card-small card1">
                <div className="card-title">총 보유 자산 <span style={{ float: "right", color: "#48BB78" }}>일일 수익률</span></div>
                <div style={{ fontSize: "1vw" }}>
                  <span>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.totalAssets} KRW`}</span>
                  <span style={{ float: "right", color: "#48BB78" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.returnRate.toFixed(2)}`} %</span>
                </div>
              </div>

              <div className="info-card-small card2">
                <div className="card-title">총 매수</div>
                <div style={{ fontSize: "0.8vw" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.totalPurchase}`} KRW</div>
                <div className="card-title">총 평가</div>
                <div style={{ fontSize: "0.8vw" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.totalValuation}`} KRW</div>
              </div>

              <div className="info-card-small card3">
                <div className="card-title">보유 금액</div>
                <div style={{ fontSize: "0.8vw" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.heldKRW}`} KRW</div>
                <div className="card-title">주문가능금액</div>
                <div style={{ fontSize: "0.8vw" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.heldKRW}`} KRW</div>
              </div>

              <div className="info-card-small card4">
                <div className="card-title">평가 손익<span style={{ float: "right", color: "#48BB78" }}>현재 수익률</span></div>
                <div style={{ fontSize: "1vw" }}>
                  <span>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.valuationProfit}`} KRW</span>
                  <span style={{ float: "right", color: "#48BB78" }}>{assetEmpty ? "자산 정보가 없습니다." : `${assetData.valuationProfitRatio.toFixed(2)}`} %</span>
                </div>
              </div>
            </>
          )}

          <div className="info-card-medium">
            <div className="card-title" style={{
              position: 'absolute',
              top: '0.5vh',
              left: '5%'}}>투자 요약</div>
            
            {investmentLoading || investmentError ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="spinner"></div>
              </div>
            ) : (
              <div className='card-content' style={{paddingTop:"1.2vh"}}>
                {tradeInitialized === false ? (
                  <div> &nbsp;&nbsp;&nbsp;투자가 아직 시작되지 않았습니다. </div>
                ) : (
                  <>
                    <div>누적 수익률</div>
                    <div style={{ fontSize: "1vw", color: investmentData.returnRate > 0 ? "#EB5757" : "#2D9CDB", }}> {`${investmentData.returnRate} %`} </div>
                    <div>총 거래 횟수</div>
                    <div style={{ fontSize: "1vw" }}>{`${investmentData.totalTransactionCount}`}</div>
                    <div>첫 거래 날짜</div>
                    <div style={{ color: "#A0AEC0" }}>{`${investmentData.firstTransactionTime}`}</div>
                    <div>마지막 거래 날짜</div>
                    <div style={{ color: "#A0AEC0" }}>{`${investmentData.lastTransactionTime}`}</div>
                  </>
                )}
              </div>
            )}
          </div>
          
          <div className="info-card-large">
            <div className="card-title" style={{
              position: 'absolute',
              top: '0.5vh',
              left: '5%',      
              paddingBottom: "1.5vh"}}>최근 거래 {decisionCount}회 의사결정 현황</div>
            <DecisionStatusChart />
          </div>

          <div className="chart">
            <div className="ticker">
              <img src={bitcoinIcon} alt="Bitcoin Icon" style={{ width: '1.8vw', height: '1.8vw', marginRight: '0.8vw', marginTop: '1.1vh' }} />
              <span style={{ fontSize: '1.8vw'}}>비트코인 </span>
              <span style={{ position: 'relative', top: '0.8vw', fontSize: '1vw' }}>&nbsp;BTC/KRW</span>
            </div>
            <CoinChart />
          </div>
          
          <div className="sidebar">
            <div className="card-title" style={{
              position: 'absolute',
              top: '2.5%',
              left: '5%',
              paddingBottom: "5%"}}>투자 내역</div>
            <Timeline />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetOverview;
