import { useState } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import styled from "styled-components";
import PropTypes from "prop-types";
import { FaPlus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5";

const QuantAgent = ({ className, quantData }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 데이터 전처리 함수
  const processChartData = (rawData) => {
    if (!rawData) return [];

    return rawData.map((item) => {
      const date = new Date(item.candle_date_time_kst);
      return {
        date: `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:00`,
        open: item.open / 1000000,
        close: item.close / 1000000,
        high: item.high / 1000000,
        low: item.low / 1000000,
        volume: item.volume,
        isIncreasing: item.close > item.open,
      };
    }).reverse();
  };

  const chartData = processChartData(quantData?.raw_data);

  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="font-bold">차트 데이터 분석</div>
        <MoreButton onClick={handleMoreClick}>
          <FaPlus />
        </MoreButton>
      </div>
      <div className="relative w-full h-full">
        <div
          className="absolute bottom-0 left-[-50px]"
          style={{
            width: "300px",
            height: "150px",
            margin: "10px",
          }}
        >
          <LineChart
            width={300}
            height={150}
            data={chartData}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
          >
            {/* X축 추가 */}
            <XAxis
              dataKey="date"
              // tickFormatter={(tick) => tick.split(" ")[1]} // 시간만 표시
              interval={3} // 3번째 데이터마다 표시
              // tick={{ fontSize: 2 }}
              tick={false}
            />

            {/* Y축 추가 */}
            <YAxis
              domain={["auto", "auto"]}
              tickFormatter={(value) => `${value}M`} // 값 뒤에 "M" 추가
              tick={{ fontSize: 10 }}
            />

            {/* Cartesian Grid 추가 */}
            <CartesianGrid strokeDasharray="3 3" />

            {/* Line 설정 */}
            <Line
              type="monotone"
              dataKey="close"
              stroke="#8884d8"
              strokeWidth={2}
              dot={false} // 점 표시 제거
            />
          </LineChart>
        </div>
      </div>



      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className="flex flex-col gap-4">
              <h2 className="font-bold text-[32px]">차트 데이터 분석</h2>

              {/* 막대 그래프 */}
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
                    tick={{fontSize: 6}}
                  />
                  <YAxis
                    domain={["auto", "auto"]}
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
                  <Bar
                    dataKey="close"
                    fill="#8884d8"
                    barSize={8}
                  />
                </ComposedChart>
              </div>
              <div
                className="font-bold text-[32px] pl-[75px] pr-[75px]"
                style={{
                  color:
                    quantData?.decision === 'BUY'
                      ? 'var(--trai-buy)'
                      : quantData?.decision === 'SELL'
                      ? 'var(--trai-sell)'
                      : 'var(--trai-text)',
                }}
              >
                {quantData?.decision}
              </div>
              <div className="text-[18px] font-medium leading-9 ml-[75px] mr-[75px]">{quantData?.summary}</div>

              <CloseButton onClick={handleCloseModal}>
                <IoCloseCircleOutline />
              </CloseButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

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
};

export default QuantAgent;

const MoreButton = styled.button`
  font-size: 16px;
  color: var(--trai-text);
  cursor: pointer;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--trai-white);
  color: var(--trai-text);
  padding: 30px 40px 30px 30px;
  border-radius: 10px;
  width: 800px;
  height: 550px;
  position: relative;
  overflow-y: auto;
  box-sizing: content-box;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 8px;
    margin-right: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--trai-navy);
    border: 2px solid var(--trai-white);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--trai-disabled);
    margin: 10px 0;
    border: 4px solid var(--trai-white);
  }
`;

const CloseButton = styled.button`
  position: absolute;
  font-size: 32px;
  top: 20px;
  right: 20px;
  color: var(--trai-navy);
  cursor: pointer;
`;
