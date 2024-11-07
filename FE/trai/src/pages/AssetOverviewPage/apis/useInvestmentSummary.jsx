import { useState, useEffect } from "react";
import axios from "axios";

function formatDate(isoString) {
    if(isoString === '0') reteurn `거래가 아직 시작되지 않았습니다.`

    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds}`;
}
  
const useInvestmentSummary = () => {

  const [investmentData, setData] = useState({});
  const [tradeInitialized, setInitialized] = useState(false);
  const [investmentLoading, setLoading] = useState(true);
  const [investmentError, setError] = useState(null);

  const token ='eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiYWRtaW5AbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MzA4NzIwODIsImV4cCI6MTAxNzMwODcyMDgyfQ.saDJ6_TfVvQxS32DWE13k1tHt8Ong6uF5fLc3SXqLJ0'


  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://wwww.trai-ai.site/api/investments/summary`, {
        headers: {
          access: `${token}`
        }
      })
      .then((res) => res.data)
      .then((data) => {
        
        if(data.totalTransactionCount>0) {
            setInitialized(true)
        }

        const totalTransactionCount = data ? parseInt(data.totalTransactionCount) : 0;
        const firstTransactionTime = formatDate(data ? String(data.firstTransactionTime) : '0');
        const lastTransactionTime = formatDate(data ? String(data.lastTransactionTime) : '0');
        const bid = data ? parseFloat(data.bid) : 0;
        const ask = data ? parseFloat(data.ask) : 0;
        const profit = data ? parseFloat(data.profit) : 0;
        const totalValuation = ask + profit;
        const returnRate = ((totalValuation / bid) * 100).toFixed(2);   //bid를 기준으로 현재 자산의 평가액(ask + profit)이 얼마나 증가했는지
       
        // formattedData 구성
        const formattedData = {
            totalTransactionCount,
            firstTransactionTime,
            lastTransactionTime,
            returnRate
        };

        setData(formattedData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  return { investmentData, tradeInitialized, investmentLoading, investmentError};
};

export default useInvestmentSummary;