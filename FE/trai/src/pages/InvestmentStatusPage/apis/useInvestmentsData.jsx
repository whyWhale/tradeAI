import React, { useState, useEffect } from "react";

import axios from "axios";

const useInvestmentsData = (currentPage = 0, size = 12) => {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null); // 새로운 요청 시작 전에 error를 초기화

    axios
      .get("https://www.trai-ai.site/api/investments", {
        params: {
          page: currentPage,
          size: size,
          sort: "property,asc"
        }
      })
      .then((res) => {
        const responseData = res.data;
        setData(responseData.content || []); // 데이터가 없을 경우 빈 배열로 설정
        setTotalPages(responseData.totalPages || 0); // 페이지 수
        setTotalElements(responseData.totalElements || 0); // 전체 요소 수
      })
      .catch((err) => {
        console.error("Error fetching paged data:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage, size]);

  return { data, totalPages, totalElements, loading, error };
};

export default useInvestmentsData;