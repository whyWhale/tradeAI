const useRealTimeAssetValue = (BTCPrice, assetData) => {
  if (!assetData || BTCPrice === null) return assetData;

  const BitcoinAmount = assetData.BitcoinAmount || 0;
  const TotalInvestment = assetData.TotalInvestment || 1; // 기본값을 1로 설정하여 0으로 나누기 방지
  const TotalKRWAssets = assetData.TotalKRWAssets || 0;
  const NetAssetChange = assetData.NetAssetChange || 0;
  const TotalDeposit = assetData.TotalDeposit || 0;
  const StartingAsset = assetData.StartingAsset || 0;
  
  // totalEvaluation 계산
  const totalEvaluation = BTCPrice * BitcoinAmount;
  const totalAssetValue = totalEvaluation + TotalKRWAssets;

  // 계산 중 NaN이 발생하지 않도록 각 계산마다 유효성 검사를 추가
  const updatedAssetData = {
    ...assetData,
    totalValuation: (BTCPrice * assetData.BitcoinAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    totalAssets: (BTCPrice * assetData.BitcoinAmount + assetData.TotalKRWAssets).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    valuationProfit: (BTCPrice * assetData.BitcoinAmount - assetData.TotalInvestment).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
    valuationProfitRatio: assetData.TotalInvestment !== 0 ? 100 * (BTCPrice * assetData.BitcoinAmount - assetData.TotalInvestment) / assetData.TotalInvestment : 0, // TotalInvestment가 0일 경우 0을 반환
     returnRate: 100* ((BTCPrice * assetData.BitcoinAmount)+assetData.TotalKRWAssets + assetData.NetAssetChange) / (assetData.StartingAsset+assetData.TotalDepositAmount),
};

  return updatedAssetData;
};

export default useRealTimeAssetValue;
