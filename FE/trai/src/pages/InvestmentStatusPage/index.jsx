import React from 'react';
import NavBar from '@components/NavBar';
import './index.scss';
import InvestmentDetailsTable from '../../components/InvestmentDetailsTable/index.jsx';
import CurrentAssetAllocationChart from '../../components/DonutChart/CurrentAssetAllocationChart.jsx'
import InvestmentHistory from '../../components/InvestmentHistory/index.jsx';

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
        <div className="card-detailedInvestmentReport">
        <div className="card-title" style={{
            position: 'absolute',
            alignItems: 'flex-start',
            top: '2.5%',
            width: '95%',
            paddingBottom: "5%"}} >투자 손익 상세
          <InvestmentDetailsTable/></div>
        </div>
        {/* 자산 비중 추이 */}
        <div className="card-investmentHistory">
          <div className="card-title" style={{
            position: 'absolute',
            alignItems: 'flex-start',
            top: '2.5%',
            width: '95%',
            paddingBottom: "5%"}}>자산 비중 추이</div>
          <InvestmentHistory/>
        </div>
        {/* 현재 자산 비중 */}
        <div className="card-currentAssetAllocation">
          <div className="card-title" style={{
            position: 'absolute',
            alignItems: 'flex-start',
            top: '2.5%',
            width: '95%',
            paddingBottom: "5%"}}>현재 자산 비중</div>
          <CurrentAssetAllocationChart/>
        </div>
      </div>
    </div>
  );
};

export default InvestmentStatus;
