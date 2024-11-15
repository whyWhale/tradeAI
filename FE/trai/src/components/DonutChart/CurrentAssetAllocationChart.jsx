import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import useAssetAllocationData from './apis/useAssetAllocationData';

const CurrentAssetAllocationChart = () => {
    
    const { assetAllocationData, assetAllocationLoading, assetAllocationError} = useAssetAllocationData();

    if (assetAllocationLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div className="spinner"></div></div>;
    if (assetAllocationError) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Error</div>;;
    if (assetAllocationData) {
        return (
            <div className='piechart' style={{ width: '100%', height: '90%', margin: '0 auto' }}>
                <ResponsivePie
                    data={assetAllocationData}
                    margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    innerRadius={0.5}
                    padAngle={1}
                    cornerRadius={3}

                    colors={[ '#EAB300','#4FD1C5' ]}
                    borderWidth={0}
            
                    // 그라데이션 정의
                    defs={[
                        {
                            id: 'gradientA',
                            type: 'linearGradient',
                            colors: [
                                { offset: 0, color: '#EAB300' },
                                { offset: 100, color: '#FFC107' }
                            ]
                        },
                        {
                            id: 'gradientB',
                            type: 'linearGradient',
                            colors: [
                                { offset: 0, color: '#4FD1C5' },
                                { offset: 100, color: '#81E6D9' }
                            ]
                        }
                    ]}

                    // 각 데이터 항목에 그라데이션 적용
                    fill={[
                        { match: { id: '총 평가' }, id: 'gradientA' },
                        { match: { id: '보유 KRW' }, id: 'gradientB' }
                    ]}

                    arcLinkLabelsDiagonalLength={10}
                    arcLinkLabelsStraightLength={10}
                    arcLinkLabelsTextColor="#101010"
                    arcLinkLabelsThickness={0}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={0}
                    theme={{
                        labels: {
                            text: {
                                fontSize: '0.8rem',
                                fill: 'var(--trai-white)',
                                fontFamily: 'Pretendard-Regular',
                                color: 'var(--trai-white)'
                            },
                        },
                        legends: {
                            text: {
                                fontSize: '1rem',
                                fill: '#101010',
                                fontFamily: 'Pretendard-Regular',
                            },
                        },
                    }}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 80,
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 15,
                            symbolShape: 'circle',
                            effects: [
                                {
                                    on: 'hover',
                                    style: {
                                        itemWidth: 'olive',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            </div>
        );
    }
};

export default CurrentAssetAllocationChart;
