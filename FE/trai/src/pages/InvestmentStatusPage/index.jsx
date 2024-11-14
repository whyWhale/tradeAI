import React from 'react';
import { useState } from 'react';
import NavBar from '@components/NavBar';
import './index.scss';
import InvestmentDetailsTable from '../../components/InvestmentDetailsTable/index.jsx';
import CurrentAssetAllocationChart from '../../components/DonutChart/CurrentAssetAllocationChart.jsx'
import InvestmentHistory from '../../components/InvestmentHistory/index.jsx';
import BitBot from '@components/BitBot';

const InvestmentStatus = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="investment-status">
      {/* Left Sidebar */}
      <aside className="navbar">
        <NavBar openModal={openModal} />
      </aside>

      {/* Main Content */}
      <div className="main-content">
        {/* 투자 손익 상세 */}
        <div className="card-detailedInvestmentReport">
        <div className="card-title" style={{
            position: 'absolute',
            alignContent:'space-between',
            top: '2.5%',
            width: '95%',
            paddingBottom: "5%"}} >투자 손익 상세 </div>
          <InvestmentDetailsTable/>
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
      {isModalOpen && <BitBot onClose={closeModal} />}
    </div>
  );
};

export default InvestmentStatus;
