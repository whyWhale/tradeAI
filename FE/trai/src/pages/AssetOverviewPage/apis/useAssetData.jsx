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
      .post(`/api/upbits/accounts`, {
      })
      .then((res) => res.data)
      .then((data) => {
        if(data!==null){
          const KRWData = data.find((item) => item.currency === "KRW");
          const BTCData = data.find((item) => item.currency === "BTC");
          
          price = parseFloat(BTCPrice.replace(/,/g, ""));


          // 'KRW'와 'BTC' 데이터가 없을 경우
          const heldKRW = KRWData ? parseFloat(KRWData.balance) : 0;
          const BTCBalance = BTCData ? parseFloat(BTCData.balance) : 0;
          const avgBuyPrice = BTCData ? parseFloat(BTCData.avg_buy_price) : 0;

          // 계산
          const totalPurchase = BTCBalance * avgBuyPrice;
          const totalValuation = price * BTCBalance;
          const valuationProfit = totalValuation - totalPurchase;
          const valuationProfitRatio = totalPurchase ? ((valuationProfit / totalPurchase) * 100).toFixed(2) : 0;
          const totalAssets = totalValuation + heldKRW;
          const returnRate = (totalPurchase + heldKRW) ? ((totalAssets / (totalPurchase + heldKRW)) * 100).toFixed(2) : 0;

          const heldKRWValue = heldKRW.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const totalPurchaseValue = totalPurchase.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const totalValuationValue = totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const valuationProfitValue = totalValuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          const totalAssetsValue = totalAssets.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

          console.log("totalPurchase: "+totalPurchase);
          console.log("totalValuation: "+totalValuation);
          console.log("avgBuyPrice: "+avgBuyPrice);
          console.log("BTCBalance: "+BTCBalance);
          console.log("heldKRW: "+heldKRW);

          // formattedData 구성
          const formattedData = {
            totalPurchase:totalPurchaseValue,
            totalValuation:totalValuationValue,
            heldKRW: heldKRWValue,
            availableBalance: heldKRWValue,
            valuationProfit: valuationProfitValue,
            valuationProfitRatio,
            totalAssets:totalAssetsValue,
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
  }, [BTCPrice]);

  return { assetData, assetLoading, assetEmpty, assetError };
};

export default useAssetData;