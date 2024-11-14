const useRealTimeAssetValue = (BTCPrice, assetData) => {
  if (!assetData || BTCPrice === null) return assetData;

  const BitcoinAmount = assetData.BitcoinAmount || 0;
  const TotalInvestment = assetData.TotalInvestment || 1; // 기본값을 1로 설정하여 0으로 나누기 방지
  const TotalKRWAssets = assetData.TotalKRWAssets || 0;
  const NetAssetChange = assetData.NetAssetChange || 0;
  
  // totalEvaluation 계산
  const totalEvaluation = BTCPrice * BitcoinAmount;
  const totalAssetValue = totalEvaluation + TotalKRWAssets;

  // 계산 중 NaN이 발생하지 않도록 각 계산마다 유효성 검사를 추가
  const updatedAssetData = {
    ...assetData,
    totalValuation: !isNaN(totalEvaluation) ? totalEvaluation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0',
    totalAssets: !isNaN(totalAssetValue) ? totalAssetValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0',
    valuationProfit: !isNaN(totalEvaluation - TotalInvestment) ? (totalEvaluation - TotalInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '0',
    valuationProfitRatio: !isNaN((totalEvaluation - TotalInvestment) / TotalInvestment) ? ((totalEvaluation - TotalInvestment) / TotalInvestment) : 0,
    returnRate: !isNaN((totalEvaluation + NetAssetChange) / TotalInvestment * 100) ? ((totalEvaluation + NetAssetChange) / TotalInvestment * 100) : 0,
  };

  return updatedAssetData;
};

export default useRealTimeAssetValue;
