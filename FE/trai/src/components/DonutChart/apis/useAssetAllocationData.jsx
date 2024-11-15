import React, { useState, useEffect } from "react";
import { instance } from "../../../api/axios";

const useAssetAllocationData = () => {

  const [assetAllocationData, setData] = useState([]);
  const [assetAllocationLoading, setLoading] = useState(true);
  const [assetAllocationError, setError] = useState(null);  

    useEffect(() => {
        setLoading(true);

        instance
        .get('api/investments/assets')
        .then((res) => res.data)
        .then((data) => {
            if (data !== null) {
                const totalEvaluation = parseFloat(data.totalEvaluation);
                const heldKRW = parseFloat(data.totalKRWAssets);
                const total = totalEvaluation+heldKRW;
                const formattedData = [
                    { id: '총 평가', value: (totalEvaluation/total).toFixed(2)*100 },
                    { id: '보유 KRW', value: (heldKRW/total).toFixed(2)*100 },
                ]
                setData(formattedData);
            }else{
                const formattedData = [
                    { id: '총 평가', value: 0 },
                    { id: '보유 KRW', value: 0 },
                ]
                setData(formattedData);
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

    return { assetAllocationData, assetAllocationLoading, assetAllocationError};
};

export default useAssetAllocationData;
