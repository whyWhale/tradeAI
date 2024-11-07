import { useState, useEffect } from "react";
import axios from "axios";

function formatDate(isoString) {
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // 오전/오후 구분
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 12시간제로 변환 (0시는 12로 표시)
  
    return `${year}년 ${month}월 ${day}일 ${hours}:${minutes}:${seconds} ${period}`;
  }
  
const useTimelineData = () => {

  const [timelineData, setData] = useState({});
  const [timelineLoading, setLoading] = useState(true);
  const [timelineError, setError] = useState(null);
  const [isEmpty, setEmpty] = useState(true);

  const token ='eyJhbGciOiJIUzI1NiJ9.eyJjYXRlZ29yeSI6ImFjY2VzcyIsInVzZXJuYW1lIjoiYWRtaW5AbmF2ZXIuY29tIiwicm9sZSI6IlJPTEVfQURNSU4iLCJpYXQiOjE3MzA4NzIwODIsImV4cCI6MTAxNzMwODcyMDgyfQ.saDJ6_TfVvQxS32DWE13k1tHt8Ong6uF5fLc3SXqLJ0'

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://www.trai-ai.site/api/transaction-histories/latest`, {
        headers: {
          access: `${token}`
        }
      })
      .then((res) => res.data)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
            const formattedData = data.map((transaction) => {
                const money = parseInt(transaction.money);
                const date = formatDate(String(transaction.createdAt));
                const kind = transaction.kind;
                const volume = data.volume;

                return {
                  money,
                  volume,
                  date,
                  kind
                };
            });
            setData(formattedData);
            setEmpty(false);
        } else {
            // 빈 배열이 올 경우
            setEmpty(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return { timelineData, timelineLoading, timelineError, isEmpty};
};

export default useTimelineData;