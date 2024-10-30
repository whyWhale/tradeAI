import React from 'react';
import NavBar from '@components/NavBar';
import './index.scss';

const AssetOverview = () => {
  return (
    <div className="investment-status">
      {/* Left Sidebar */}
      <aside className="navbar">
        <NavBar />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* Info Cards */}
        <div className="info-card-small card1">
          <div className="card-title">총 보유 자산</div>
          <div style={{ fontSize: "18px" }}><span>5000KRW</span><span style={{ float: "right", color: "#48BB78" }}>+5%</span></div>
        </div>
        
        <div className="info-card-small card2">
          <div className="card-title">총 매수</div>
          <div style={{ fontSize: "12px" }}>3000KRW</div>
          <div className="card-title">총 평가</div>
          <div style={{ fontSize: "12px" }}>3000KRW</div>
        </div>
        
        <div className="info-card-small card3">
          <div className="card-title">보유 KRW</div>
          <div style={{ fontSize: "12px" }}>3000KRW</div>
          <div className="card-title">주문가능금액</div>
          <div style={{ fontSize: "12px" }}>3000KRW</div>
        </div>
        
        <div className="info-card-small card4">
          <div className="card-title">평가 손익</div>
          <div style={{ fontSize: "18px" }}><span>5000KRW</span><span style={{ float: "right", color: "#48BB78" }}>+5%</span></div>
        </div>

        {/* Right Side Info Cards */}
        <div className="info-card-medium">
          <div className="card-title" style={{  paddingBottom: "5%"}}>투자 요약</div>
          <div className="card-content">누적 수익률</div>
          <div style={{ fontSize: "17px" }}>6.50%</div>
          <div className="card-content">총 거래 횟수</div>
          <div style={{ fontSize: "17px" }}>200</div>
          <div className="card-content">첫 거래 날짜</div>
          <div className="card-content" style={{ color: "#48BB78" }}>2024월 9월 17일 04:01:36</div>
          <div className="card-content">마지막 거래 날짜</div>
          <div className="card-content" style={{ color: "#48BB78" }}>2024월 10월 30일 14:10:00</div>
          
        </div>
        
        <div className="info-card-large">
          <div className="card-title">최근 거래 요약</div>
        </div>

        {/* Bottom Chart and Sidebar */}
        <div className="chart">
          <div className="card-title">비트코인 차트</div>
        </div>
        
        <div className="sidebar">
          <div className="card-title">투자 내역</div>
        </div>
      </div>
    </div>
  );
};

export default AssetOverview;
