import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { useSelector } from 'react-redux';

const DecisionStatusChart = () => {
    const holdCount = useSelector((state) => state.decisionCount.holdCount);
    const buyCount = useSelector((state) => state.decisionCount.buyCount);
    const sellCount = useSelector((state) => state.decisionCount.sellCount);

    const isAllZero = holdCount === 0 && buyCount === 0 && sellCount === 0;

    return (
        <div className='piechart' style={{ width: '100%', height: '90%', margin: '0 auto' }}>
            {isAllZero ? (
                <div className='card-content' style={{marginTop:'23%'}}>
                    &nbsp;&nbsp;&nbsp;투자가 아직 시작되지 않았습니다.
                </div>
            ) : (
                <ResponsivePie
                    data={[
                        { id: '매도', value: sellCount },
                        { id: '매수', value: buyCount },
                        { id: '홀드', value: holdCount },
                    ]}
                    margin={{ top: 20, right: 0, bottom: 20, left: 0 }}
                    innerRadius={0.5}
                    padAngle={1}
                    cornerRadius={3}
                    colors={['#2D9CDB', '#EB5757', '#CBD5E0']}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#101010"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    theme={{
                        labels: {
                            text: {
                                fontSize: '0.8rem',
                                fill: '#101010',
                                fontFamily: 'Pretendard-Regular',
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
                                        itemTextColor: 'olive',
                                    },
                                },
                            ],
                        },
                    ]}
                />
            )}
        </div>
    );
};

export default DecisionStatusChart;
