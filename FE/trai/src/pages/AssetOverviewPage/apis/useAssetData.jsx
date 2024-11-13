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
      .get(`api/investments/assets`, {
      })
      .then((res) => res.data)
      .then((data) => {
        if(data!==null){
          const totalPurchase=parseFloat(data.totalInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
          const totalValuation=parseFloat(data.totalEvaluation).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
          const heldKRW=parseFloat(data.totalKRWAssets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
          const availableBalance=parseFloat(data.availableAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
          const valuationProfit=parseFloat(data.profitAndLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
          const valuationProfitRatio=data.totalProfitAndLossRatio;
          const totalAssets=parseFloat(data.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2,});
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