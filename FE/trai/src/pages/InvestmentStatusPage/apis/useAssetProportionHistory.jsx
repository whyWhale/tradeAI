import React, { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

function formatDate(isoString) {
  const date = new Date(isoString);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${month}월 ${day}일`;
}

const useAssetProportionHistory = () => {
  const [assetProportionData, setData] = useState([]);
  const [assetProportionLoading, setLoading] = useState(true);
  const [assetProportionError, setError] = useState(null);
  const [assetProportionEmpty, setEmpty] = useState(false);
  

  useEffect(() => {
    setLoading(true);

    instance
    .get('/api/assets/daily')
    .then((res) => res.data)
    .then((data) => {
      if (Array.isArray(data) && data.length > 0) {
        const formattedData = data.map((item) => {
          const coinPercentage = parseInt(item.coinPercentage);
          return {
              'date': formatDate(item.createdAt),
              '코인 비중': coinPercentage,
              '기타 비중': 100 - coinPercentage,
          };
        });
        setData(formattedData);
        setEmpty(false);
      } else {
        // 빈 배열일 경우
        setEmpty(true);
      }
    })
    .catch((err) => {
        console.error("Error fetching asset proportion history:", err);
        setError(err);
    })
    .finally(() => {
        setLoading(false);
    });
  }, []);

  return { assetProportionData, assetProportionLoading, assetProportionEmpty, assetProportionError };
};

export default useAssetProportionHistory;
