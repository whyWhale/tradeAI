import { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

const useAssetData = (BTCPrice) => {
  const [assetData, setAssetData] = useState(null);
  const [assetEmpty, setEmpty] = useState(false);
  const [assetLoading, setLoading] = useState(true);
  const [assetError, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    instance
      .get(`api/investments/assets`, {})
      .then((res) => res.data)
      .then((data) => {
        if (data !== null) {
          const formattedData = {
            totalPurchase: parseFloat(data.totalInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            totalValuation: parseFloat(data.totalEvaluation).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            heldKRW: parseFloat(data.totalKRWAssets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            availableBalance: parseFloat(data.availableAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            valuationProfit: parseFloat(data.profitAndLoss).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            valuationProfitRatio: data.totalProfitAndLossRatio,
            totalAssets: parseFloat(data.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            returnRate: data.profitAndLossRatio,
            BitcoinAmount: parseFloat(data.bitcoinAmount),
            TotalInvestment: parseFloat(data.totalInvestment),
            TotalKRWAssets: parseFloat(data.totalKRWAssets),
            TotalDepositAmount: parseFloat(data.totalDepositAmount),
            StartingAsset: parseFloat(data.startingAssets),
            NetAssetChange: parseFloat(data.totalWithdrawAmount) - parseFloat(data.totalDepositAmount) - parseFloat(data.startingAssets),
          };
          setAssetData(formattedData);
          console.log(formattedData);
        } else {
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
  }, []); // 빈 배열로 설정하여 컴포넌트 초기 로드 시에만 실행

  // BTCPrice 또는 assetData가 변경될 때 동적으로 업데이트
  useEffect(() => {
    if (assetData && BTCPrice !== null) {
      const updatedAssetData = {
        ...assetData,
        totalValuation: (BTCPrice * assetData.BitcoinAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        totalAssets: (BTCPrice * assetData.BitcoinAmount + assetData.TotalKRWAssets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        valuationProfit: (BTCPrice * assetData.BitcoinAmount - assetData.TotalInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
        valuationProfitRatio: (BTCPrice * assetData.BitcoinAmount - assetData.TotalInvestment) / assetData.TotalInvestment,
        returnRate: 100* ((BTCPrice * assetData.BitcoinAmount)+assetData.TotalKRWAssets + assetData.NetAssetChange) / (assetData.StartingAsset+assetData.TotalDepositAmount),
      };
      setAssetData(updatedAssetData);
    }
  }, [BTCPrice, assetData]);

  return { assetData, assetLoading, assetEmpty, assetError };
};

export default useAssetData;
