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
        <div className="info-card-small card1">총 보유 자산</div>
        <div className="info-card-small card2">총 매수</div>
        <div className="info-card-small card3">보유 KRW</div>
        <div className="info-card-small card4">평가 손익</div>

        {/* Right Side Info Cards */}
        <div className="info-card-medium">투자 요약</div>
        <div className="info-card-large">최근 거래 요약</div>

        {/* Bottom Chart and Sidebar */}
        <div className="chart">비트코인 차트</div>
        <div className="sidebar">투자 내역</div>
      </div>
    </div>
  );
};

export default AssetOverview;
