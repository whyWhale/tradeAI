import { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

const useAssetData = (BTCPrice) => {
  // BTCData가 존재하지 않으면 실행하지 않음

  const [assetData, setData] = useState({});
  const [assetEmpty, setEmpty] = useState(false);
  const [assetLoading, setLoading] = useState(true);
  const [assetError, setError] = useState(null);


  useEffect(() => {
    if (!BTCPrice) return;
    setLoading(true);
    instance
      .post(`/api/upbits/accounts`, {})
      .then((res) => res.data)
      .then((data) => {
        if(data!==null){
          const KRWData = data.find((item) => item.currency === "KRW");
          const BTCData = data.find((item) => item.currency === "BTC");

          // 'KRW'와 'BTC' 데이터가 없을 경우 기본값 설정
          const heldKRW = KRWData && KRWData.balance ? parseFloat(KRWData.balance) : 0;
          const BTCBalance = BTCData && BTCData.balance ? parseFloat(BTCData.balance) : 0;
          const avgBuyPrice = BTCData && BTCData.avg_buy_price ? parseFloat(BTCData.avg_buy_price) : 0;
          const BTCPrice = BTCPrice || 0; // BTCPrice도 명확히 값이 설정되었는지 확인

          // 계산
          const totalPurchase = (BTCBalance * avgBuyPrice) || 0;
          const totalValuation = (BTCPrice * BTCBalance) || 0;
          const valuationProfit = totalValuation - totalPurchase;
          const valuationProfitRatio = totalPurchase ? ((valuationProfit / totalPurchase) * 100) : 0;
          const totalAssets = totalValuation + heldKRW;
          const returnRate = (totalPurchase + heldKRW) ? ((totalAssets / (totalPurchase + heldKRW)) * 100) : 0;

          // 숫자 포맷 적용
          const formattedTotalPurchase = totalPurchase.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedTotalValuation = totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedValuationProfit = valuationProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedValuationProfitRatio = valuationProfitRatio.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedTotalAssets = totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const formattedReturnRate = returnRate.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          // formattedData 구성
          const formattedData = {
            totalPurchase: formattedTotalPurchase,
            totalValuation: formattedTotalValuation,
            heldKRW: parseInt(heldKRW),
            availableBalance: heldKRW,
            valuationProfit: formattedValuationProfit,
            valuationProfitRatio: formattedValuationProfitRatio,
            totalAssets: formattedTotalAssets,
            returnRate: formattedReturnRate
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
  }, [BTCPrice]);

  return { assetData, assetLoading, assetEmpty, assetError };
};

export default useAssetData;