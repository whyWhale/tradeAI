import { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from 'react-redux';
import { setCounts } from '../../store/reducers/decisionCountSlice';

function formatDate(isoString) {
    const date = new Date(isoString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    // 오전/오후 구분
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // 12시간제로 변환 (0시는 12로 표시)
  
    return `${month}월 ${day}일 ${hours}:${minutes}:${seconds} ${period}`;
  }
  
const useTimelineData = () => {

  const dispatch = useDispatch();

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
        const counts = { hold: 0, buy: 0, sell: 0 };
        if (Array.isArray(data) && data.length > 0) {
            // 최대 30개의 데이터만 가져오기
            const limitedData = data.slice(0, 30);
            const formattedData = limitedData.map((transaction) => {
                const money = parseInt(transaction.money);
                const date = formatDate(String(transaction.createdAt));
                const kind = transaction.kind;
                const volume = transaction.volume;

                // 각 종류에 따라 카운트 증가
                if (kind === "HOLD") counts.hold += 1;
                if (kind === "BUY") counts.buy += 1;
                if (kind === "SELL") counts.sell += 1;
                
                return {
                  money,
                  volume,
                  date,
                  kind
                };
            });
            setData(formattedData);
            setEmpty(false);
            // Redux 상태 업데이트
            dispatch(setCounts(counts));
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
  },[dispatch]);

  return { timelineData, timelineLoading, timelineError, isEmpty};
};

export default useTimelineData;