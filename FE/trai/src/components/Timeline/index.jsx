import React from "react";
import styled from "styled-components";

// 더미 데이터
const timelineData = [
  { type: "sell", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 17일 04:00 AM" },
  { type: "hold", date: "10월 17일 08:00 AM" },
  { type: "hold", date: "10월 17일 12:00 PM" },
  { type: "sell", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 17일 04:00 PM" },
  { type: "buy", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 00:00 AM" },
  { type: "buy", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "buy", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "sell", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "buy", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "sell", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "buy", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
  { type: "sell", amount: "0.00003 BTC", price: "2840.50 KRW", date: "10월 18일 04:00 AM" },
];

const Timeline = () => {
  return (
    <TimelineContainer>
      <Header>
        <Title>이번달</Title>
        <Profit>+30%</Profit>
      </Header>
      <TimelineList>
        {timelineData.map((item, index) => (
          <TimelineItem key={index} item={item} />
        ))}
      </TimelineList>
    </TimelineContainer>
  );
};

const TimelineItem = ({ item }) => {
  return (
    <Item>
      <Icon type={item.type} />
      <Content>
        {item.amount && <Amount>{item.amount}, {item.price}</Amount>}
        {item.type==="hold"?'hold':''}
        <Date>{item.date}</Date>
      </Content>
    </Item>
  );
};

// 스타일 정의
const TimelineContainer = styled.div`
  width: 100%;
  padding: 5%;
  overflow-y: auto;
  max-height: 90%; // 스크롤 가능하도록 최대 높이 설정
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
  margin-bottom: 20px;
`;

const Title = styled.h2`
  font-size: 16px;
  color: #333;
`;

const Profit = styled.div`
  font-size: 16px;
  color: green;
`;

const TimelineList = styled.div`
  display: flex;
  flex-direction: column;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Icon = styled.div`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${({ type }) => (type === "buy" ? "#EB5757" : type === "sell" ? "#2D9CDB" : "#CBD5E0")};
  margin-right: 10px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
`;

const Amount = styled.div`
  font-size: 14px;
  color: #333;
`;

const Date = styled.div`
  font-size: 12px;
  color: #888;
`;

export default Timeline;
