import React from "react";
import styled from "styled-components";
import useTimelineData from "./useTimelineData";

const Timeline = () => {
  const { timelineData, timelineLoading, timelineError, isEmpty } = useTimelineData();
  return (
    timelineLoading || timelineError ? (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <span className="spinner"></span>
      </div>
    ) : isEmpty ? (
      <div>투자 내역이 없습니다.</div>
    ) : (
      <TimelineContainer>
        <TimelineList>
          {timelineData.map((item, index) => (
            <TimelineItem key={index} item={item} />
          ))}
        </TimelineList>
      </TimelineContainer>
    )
  );
};

const TimelineItem = ({ item }) => {
  return (
    <Item>
      <Icon type={item.kind} />
      <Content>
        {item.volume && <Amount>{item.money} KRW</Amount>}
        {item.kind === "HOLD" ? '홀드' : (item.kind ==="SELL"?"매도":"매수")}
        <Date>{item.date}</Date>
      </Content>
    </Item>
  );
};

// 스타일 정의
const TimelineContainer = styled.div`
  width: 100%;
  padding: 0.2vw;
  overflow-y: auto;
  max-height: auto; // 스크롤 가능하도록 최대 높이 설정
  border-right: 0.1vw solid #e0e0e0;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: auto;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 1vw;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4FD1C5;
    border-radius: 1vw;
    border: 0.3vw solid #f1f1f1;
  }

  &::-webkit-scrollbar-thumb:hover {
    background-color: #3bb0a6;
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2vh;
`;

const Title = styled.h2`
  font-size: 0.9vw;
  color: #333;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 2vh;
`;

const Icon = styled.div`
  width: 1vw;
  height: 1vw;
  min-width: 1vw;
  min-height: 1vw;
  border-radius: 50%;
  background-color: ${({ type }) => (type === "BUY" ? "#EB5757" : type === "SELL" ? "#2D9CDB" : "#CBD5E0")};
  margin-right: 1vw;
  flex-shrink: 0;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Amount = styled.div`
  font-size: 1vw;
  color: #333;
`;

const Date = styled.div`
  font-size: 0.8vw;
  color: #888;
`;

export default Timeline;
