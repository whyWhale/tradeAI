import React, { useState } from 'react';
import useInvestmentsData from './hooks/useInvestmentsData';

const InvestmentDetailsTable = () => {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);

  // useInvestmentsData 훅을 사용하여 데이터 가져오기
  const { data, totalPages, loading, error } = useInvestmentsData(currentPage, itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  
  const getProfitColor = (value) => {
    if (value > 0) return '#C84A31';  // 빨간색
    if (value < 0) return '#1261C4';  // 파란색
    return 'inherit';  // 기본색상
  }

  if (loading) return <div className='spinner'></div>;
  if (error) return <div>오류가 발생했습니다. 데이터를 다시 불러와 주세요.</div>;

  return (
    <div className="investment-details-table">
      <table>
        <thead>
          <tr>
            <th>일자</th>
            <th>일일 손익</th>
            <th>일일 수익률</th>
            <th>누적 손익</th>
            <th>누적 수익률</th>
            <th>기초 자산</th>
            <th>기말 자산</th>
          </tr>
        </thead>
        <tbody>
  {data.map((item, index) => (
    <tr key={index}>
      <td>{item.settlementDate}</td>
      
      <td style={{ textAlign: "right", color: getProfitColor(item.dailyProfitAndLoss) }}>
        {item.dailyProfitAndLoss !== undefined && item.dailyProfitAndLoss !== null 
          ? `₩${Number(item.dailyProfitAndLoss).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : ""}
      </td>
      
      <td style={{ textAlign: "right", color: getProfitColor(item.dailyProfitRatio)}}>
        {item.dailyProfitRatio != null ? `${item.dailyProfitRatio}%` : ""}
      </td>
      
      <td style={{ textAlign: "right", color: getProfitColor(item.accumulationProfitAndLoss) }}>
        {item.accumulationProfitAndLoss !== undefined && item.accumulationProfitAndLoss !== null 
          ? `₩${Number(item.accumulationProfitAndLoss).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : ""}
      </td>
      
      <td style={{ textAlign: "right", color: getProfitColor(item.accumulationProfitRatio) }}>
        {item.accumulationProfitRatio != null ? `${item.accumulationProfitRatio}%` : ""}
      </td>
      
      <td style={{ textAlign: "right" }}>
        {item.startingAssets !== undefined && item.startingAssets !== null 
          ? `₩${Number(item.startingAssets).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : ""}
      </td>
      
      <td style={{ textAlign: "right" }}>
        {item.endingAssets !== undefined && item.endingAssets !== null 
          ? `₩${Number(item.endingAssets).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
          : ""}
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i)}
            className={currentPage === i ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default InvestmentDetailsTable;
