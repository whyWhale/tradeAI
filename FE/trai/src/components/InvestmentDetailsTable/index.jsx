import React, { useState } from 'react';

const InvestmentDetailsTable = () => {
  // 샘플 데이터
  const data = Array.from({ length: 50 }, (_, i) => ({
    date: `10.${21 - (i % 21)}`,
    dailyProfit: 0,
    dailyProfitRate: '0.00%',
    cumulativeProfit: 0,
    cumulativeProfitRate: '0.00%',
    initialAssets: 0,
    finalAssets: 0,
  }));

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const totalPages = Math.ceil(data.length / itemsPerPage);

  // 현재 페이지에 맞는 데이터를 가져오기
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
          {paginatedData.map((item, index) => (
            <tr key={index}>
              <td>{item.date}</td>
              <td>{item.dailyProfit}</td>
              <td>{item.dailyProfitRate}</td>
              <td>{item.cumulativeProfit}</td>
              <td>{item.cumulativeProfitRate}</td>
              <td>{item.initialAssets}</td>
              <td>{item.finalAssets}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={currentPage === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>
    </div>
  );
};

export default InvestmentDetailsTable;
