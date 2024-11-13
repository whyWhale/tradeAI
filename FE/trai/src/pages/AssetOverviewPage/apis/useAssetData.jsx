import { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

const useAssetData = () => {
  // BTCData가 존재하지 않으면 실행하지 않음
  const [assetData, setData] = useState({});
  const [assetEmpty, setEmpty] = useState(false);
  const [assetLoading, setLoading] = useState(true);
  const [assetError, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    instance
      .post(`/api/investments/assets`, {
      })
      .then((res) => res.data)
      .then((data) => {
        console.log(data);
        if(data!==null){
          const totalPurchase=data.totalInvestment;
          const totalValuation=data.totalEvaluation;
          const heldKRW=data.totalKRWAssets;
          const availableBalance=data.availableAmount;
          const valuationProfit=data.profitAndLoss;
          const valuationProfitRatio=data.totalProfitAndLossRatio;
          const totalAssets=data.totalAmount;
          const returnRate=data.profitAndLossRatio;
          // formattedData 구성
          const formattedData = {
            totalPurchase,
            totalValuation,
            heldKRW,
            availableBalance,
            valuationProfit,
            valuationProfitRatio,
            totalAssets,
            returnRate
          };
          setData(formattedData);
        } else{
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
  }, []);

  return { assetData, assetLoading, assetEmpty, assetError };
};

export default useAssetData;