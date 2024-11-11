import React from "react";
import styled from "styled-components";
import { ResponsiveBar } from '@nivo/bar';
import useAssetProportionHistory from '../../pages/InvestmentStatusPage/apis/useAssetProportionHistory';


const InvestmentHistory = () => {
  const { historyData, assetProportionLoading, assetProportionEmpty, assetProportionError} = useAssetProportionHistory();

  if (assetProportionLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}><div className="spinner"></div></div>;
  if (assetProportionError) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>Error</div>;;
  if (historyData) {
    return (
      <HistoryContainer>
        <Header>
          <Explain>전체 자산 대비 코인성 자산의 비중을 표시합니다.</Explain>
        </Header>
        {assetProportionLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><span className="spinner"></span></div>
        ) : assetProportionError ? (
            <div>에러가 발생했습니다.</div>
        ) : assetProportionEmpty ? (
            <div>자산 내역이 없습니다.</div>
        ) : (
            <MyResponsiveBar data={historyData} />
        )}
      </HistoryContainer>
    );
  }
};

// 스타일 정의
const HistoryContainer = styled.div`
  width: auto;
  overflow-y: auto;
  overflow-x: hidden;
  height: 90%; /* 최대 높이 설정 */
  padding: 5%;
  margin-bottom: 15px;
  border-right: 1px solid #e0e0e0;

     /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4FD1C5;
    border-radius: 10px;
    border: 2px solid #f1f1f1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #3bb0a6;
  }

`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Explain = styled.h2`
  font-size: 14px;
  color: #333;
`;

// Responsive Bar Chart Component with Gradient
const MyResponsiveBar = ({ data }) => (
    <div style={{ height: 550 }}>
      <ResponsiveBar
          data={data}
          keys={['코인 비중', '기타 비중']}
          indexBy="date"
          margin={{ top: 0, right: 10, bottom: 10, left: 65 }}
          padding={0.55}
          layout="horizontal"
          valueScale={{ type: 'linear' }}
          indexScale={{ type: 'band', round: true }}
          colors={[ '#EAB300','#4FD1C5' ]}
          borderRadius={2}
          borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendPosition: 'middle',
              legendOffset: -40
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor='var(--trai-white)'
          // 그라데이션 추가 설정
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
          fill={[
              { match: { id: '코인 비중' }, id: 'gradientA' },
              { match: { id: '기타 비중' }, id: 'gradientB' }
          ]}
          legends={[]}
          role="application"
          ariaLabel="Nivo bar chart demo"
          barAriaLabel={e => `${e.id}: ${e.formattedValue} in date: ${e.indexValue}`}
      />
    </div>
);

export default InvestmentHistory;
