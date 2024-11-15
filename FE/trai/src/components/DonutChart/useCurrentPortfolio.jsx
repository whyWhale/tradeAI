import { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

const useCurrentPortfolio = () => {

  const [portfoliotData, setData] = useState({});
  const [portfolioLoading, setLoading] = useState(true);
  const [portfoliotError, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    instance
      .get(`/api/investments/summary`, {
      })
      .then((res) => res.data)
      .then((data) => {
        
        if(data.totalTransactionCount>0) {
            setInitialized(true);
        }

        const heldKRW = data ? parseFloat(data.totalKRWAssets) : 0;
        const KRW = data ? parseFloat(data.availableAmount):0;
        const BTC = data ? parseFloat(data.totalEvaluation):0;

    
        // formattedData 구성
        const formattedData = [
            { id: '총 평가', value: (BTC/heldKRW)},
            { id: '보유 KRW', value: (KRW/heldKRW)}
        ]
        setData(formattedData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  },[]);

  return { portfoliotData, portfolioLoading, portfoliotError};
};

export default useCurrentPortfolio;