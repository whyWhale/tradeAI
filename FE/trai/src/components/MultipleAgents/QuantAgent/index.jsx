import { useState } from 'react';
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  CartesianGrid,
} from 'recharts';
import styled from "styled-components";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";

const QuantAgent = ({ className, quantData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // 캔들스틱 차트를 위한 데이터 전처리
  const processChartData = (rawData) => {
    if (!rawData) return [];
    
    return rawData.map(item => {
      const date = new Date(item.candle_date_time_kst);
      const open = item.open / 1000000;
      const close = item.close / 1000000;
      const high = item.high / 1000000;
      const low = item.low / 1000000;
      
      return {
        date: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
        open,
        close,
        high,
        low,
        volume: item.volume,
        isIncreasing: close > open,
        value: Math.abs(close - open), // Bar의 높이
        basis: Math.min(open, close),  // Bar의 시작점
      };
    }).reverse();
  };

  const chartData = processChartData(quantData?.raw_data);

  return (
    <div className={className}>
      <div className='flex justify-between'>
        <div>Quant Agent</div>
        <MoreButton onClick={handleMoreClick}><FaPlus /></MoreButton>
      </div>
      <div className='font-bold text-[32px] text-center mt-10 items-center'>{quantData?.decision}</div>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col gap-4'>
              <h2 className="font-bold text-[20px]">Quant Agent</h2>
              <div className='font-bold text-[32px]'>{quantData?.decision}</div>
              <div>{quantData?.summary}</div>
              
              {/* 캔들스틱 차트 */}
              <div className="w-full h-[300px] mt-4">
                <ComposedChart
                  width={740}
                  height={300}
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date"
                    angle={-45}
                    textAnchor="end"
                    height={60}
                    interval={3}
                  />
                  <YAxis 
                    domain={['auto', 'auto']}
                    tickFormatter={(value) => `${value}M`}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white p-4 border rounded shadow">
                            <p className="font-bold">{data.date}</p>
                            <p>Open: {data.open.toFixed(2)}M</p>
                            <p>High: {data.high.toFixed(2)}M</p>
                            <p>Low: {data.low.toFixed(2)}M</p>
                            <p>Close: {data.close.toFixed(2)}M</p>
                            <p>Volume: {data.volume.toFixed(2)}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  {/* 심지 선 */}
                  {chartData.map((item, index) => (
                    <ReferenceLine
                      key={`wick-${index}`}
                      segment={[
                        { x: item.date, y: item.low },
                        { x: item.date, y: item.high }
                      ]}
                      stroke="#666"
                      strokeWidth={1}
                    />
                  ))}
                  {/* 캔들 몸통 */}
                  <Bar
                    dataKey="value"
                    stackId="candlestick"
                    fill="transparent"
                    stroke="none"
                    barSize={8}
                  >
                    {chartData.map((entry, index) => (
                      <rect
                        key={`candle-${index}`}
                        fill={entry.isIncreasing ? '#26a69a' : '#ef5350'}
                        y={entry.basis}
                        width={8}
                        height={entry.value}
                      />
                    ))}
                  </Bar>
                </ComposedChart>
              </div>
              
              <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline/></CloseButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  )
}

QuantAgent.propTypes = {
  className: PropTypes.string,
  quantData: PropTypes.shape({
    decision: PropTypes.string,
    summary: PropTypes.string,
    raw_data: PropTypes.arrayOf(
      PropTypes.shape({
        candle_date_time_kst: PropTypes.string.isRequired,
        close: PropTypes.number.isRequired,
        high: PropTypes.number.isRequired,
        low: PropTypes.number.isRequired,
        open: PropTypes.number.isRequired,
        volume: PropTypes.number.isRequired,
      })
    ),
  }).isRequired,
}

export default QuantAgent;

const MoreButton = styled.button`
  font-size: 16px;
  color: var(--trai-text);
  cursor: pointer;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--trai-white);
  padding: 30px;
  border-radius: 10px;
  width: 800px;
  height: 550px;
  position: relative;
  overflow-y: auto;

  box-sizing: content-box;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--trai-navy);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--trai-disabled);
  }
`

const CloseButton = styled.button`
  position: absolute;
  font-size: 32px;
  top: 20px;
  right: 20px;
  color: var(--trai-navy);
  cursor: pointer;
`