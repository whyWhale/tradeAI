import React, { useState } from 'react';
import useInvestmentsData from '../../pages/InvestmentStatusPage/apis/useInvestmentsData';

const InvestmentDetailsTable = () => {
  const itemsPerPage = 12;
  const [currentPage, setCurrentPage] = useState(0);
  
  // useInvestmentsData 훅을 사용하여 데이터 가져오기
  const { data, totalPages, loading, error } = useInvestmentsData(currentPage, itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) return <div className='spinner'></div>;
  if (error) return <div className='spinner'></div>;

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
              <td>{item.dailyProfitAndLoss}</td>
              <td>{item.dailyProfitRatio}</td>
              <td>{item.accumulationProfitAndLoss}</td>
              <td>{item.accumulationProfitRatio}</td>
              <td>{item.startingAssets}</td>
              <td>{item.endingAssets}</td>
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
