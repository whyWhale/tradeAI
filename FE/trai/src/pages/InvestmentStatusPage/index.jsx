import React from 'react';
import NavBar from '@components/NavBar';
import './index.scss';

const InvestmentStatus = () => {
  return (
    <div className="investment-status">
      {/* Left Sidebar */}
      <aside className="navbar">
        <NavBar />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* 투자 손익 상세 */}
        <div className="info-card-large">
          <div className="card-title">투자 손익 상세</div>
        </div>
        {/* 자산 비중 추이 */}
        <div className="info-card-medium">
          <div className="card-title">자산 비중 추이</div>
        </div>
        
        <div className="info-card-small">
          <div className="card-title">현재 자산 비중</div>
        </div>
      </div>
    </div>
  );
};

export default InvestmentStatus;
