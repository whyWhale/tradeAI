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
  const [isEmpty, setEmpty] = useState(false);

  useEffect(() => {
    setLoading(true);

    instance
    .get('/api/assets/daily')
    .then((res) => res.data)
    .then((data) => {
        const formattedData = data.map((item) => {
        const coinPercentage = item.coinPercentage || 0;
        return {
            date: formatDate(item.createdAt || "0"),
            '코인 비중': coinPercentage,
            '기타 비중': 100 - coinPercentage,
        };
        });
        setData(formattedData);
    })
    .catch((err) => {
        console.error("Error fetching asset proportion history:", err);
        setError(err);
    })
    .finally(() => {
        setLoading(false);
    });
  }, []);

  return { assetProportionData, assetProportionLoading, assetProportionError };
};

export default useAssetProportionHistory;
