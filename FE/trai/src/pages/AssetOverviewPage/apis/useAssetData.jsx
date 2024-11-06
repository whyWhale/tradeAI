import { useState, useEffect } from "react";
import axios from "axios";

const useAssetData = (BTCPrice) => {
  // BTCData가 존재하지 않으면 실행하지 않음

  const [assetData, setData] = useState({});
  const [assetLoading, setLoading] = useState(true);
  const [assetError, setError] = useState(null);

  useEffect(() => {
    if (!BTCPrice) return;
    setLoading(true);
    axios
      .post(`http://localhost:8080/api/upbits/accounts`)
      .then((res) => res.data)
      .then((data) => {
        
        const KRWData = data.find((item) => item.currency === "KRW");
        const BTCData = data.find((item) => item.currency === "BTC");

        // 'KRW'와 'BTC' 데이터가 없을 경우
        const heldKRW = KRWData ? parseFloat(KRWData.balance) : 0;
        const BTCBalance = BTCData ? parseFloat(BTCData.balance) : 0;
        const avgBuyPrice = BTCData ? parseFloat(BTCData.avg_buy_price) : 0;

        // 계산
        const totalPurchase = BTCBalance * avgBuyPrice;
        const totalValuation = BTCPrice * BTCBalance;
        const valuationProfit = totalValuation - totalPurchase;
        const valuationProfitRatio = totalPurchase ? (valuationProfit / totalPurchase) * 100 : 0;
        const totalAssets = totalValuation + heldKRW;
        const returnRate = (totalPurchase + heldKRW) ? (totalAssets / (totalPurchase + heldKRW)) * 100 : 0;

        // formattedData 구성
        const formattedData = {
          totalPurchase,
          totalValuation,
          heldKRW: parseInt(heldKRW),
          availableBalance: heldKRW,
          valuationProfit,
          valuationProfitRatio,
          totalAssets,
          returnRate
        };

        setData(formattedData);
      })
      .catch((err) => {
        console.error(err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [BTCPrice]);

  return { assetData, assetLoading, assetError };
};

export default useAssetData;