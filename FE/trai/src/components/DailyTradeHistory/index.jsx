import { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import { instance } from '@api/axios';

import { FaRegCalendarAlt } from "react-icons/fa";

const DailyTradeHistory = () => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [tradeData, setTradeData] = useState([]);
  const dateInputRef = useRef(null);

  // 실제로는 이거 useEffect 전체 삭제하면 됨(가짜 데이터)
  useEffect(() => {
    const fakeData = [
      {
        orderCreatedAt: "2024.10.20 00:00:00",
        price: "91,890,000",
        averagePrice: "90,000,000",
        decision: "sell",
        excutedFunds: "918,900",
        totalEvaluation: "918,900",
        totalAmount: "918,000",
      },
      {
        orderCreatedAt: "2024.10.20 04:00:00",
        price: "91,750,000",
        averagePrice: "0",
        decision: "hold",
        excutedFunds: "0",
        totalEvaluation: "0",
        totalAmount: "918,000",
      },
      {
        orderCreatedAt: "2024.10.20 08:00:00",
        price: "92,000,000",
        averagePrice: "92,000,000",
        decision: "buy",
        excutedFunds: "918,000",
        totalEvaluation: "918,900",
        totalAmount: "920,000",
      },
    ];

    setTradeData(fakeData);
  }, []);

  const handleDateChange = async(event) => {
    const date = event.target.value;
    setSelectedDate(date);
    console.log(date);

    const [year, month, day] = date.split("-");

    try{
      const response = await instance.get('/api/transaction-histories', {
        params: {
          year, month, day
        }
      })
      if (response.data) {
        console.log("데이터 있음");
        setTradeData(response.data);
      } else {
        console.log("데이터 없음");
        setTradeData([]);
      }
    } catch(error){
      console.error("데이터 요청 오류: ", error);
      setTradeData([]);
    }
  }


  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  }

  return(
    <Container>
      <div className="flex gap-2 items-center m-3">
        <FaRegCalendarAlt onClick={openDatePicker} className='text-[24px] text-trai-text'/>
        <HiddenDateInput
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="text-[20px] font-bold"
        />
      </div>
      
      <Table>
        <thead>
          <tr>
            <th>날짜</th>
            <th>비트코인 시세</th>
            <th>평단가</th>
            <th>판단</th>
            <th>거래 금액</th>
            <th>총 평가</th>
            <th>총 보유자산</th>
            <th>선택</th>
          </tr>
        </thead>
        
        <tbody>
          {tradeData.length > 0 ? (
            tradeData.map((data, index) => (
              <tr key={index}>
                <td>{data.orderCreatedAt}</td>
                <td>{data.price}</td>
                <td>{data.averagePrice}</td>
                <td><ActionLabel type={data.decision}>{data.decision.toUpperCase()}</ActionLabel></td>
                <td>{data.excutedFunds}</td>
                <td>{data.totalEvaluation}</td>
                <td>{data.totalAmount}</td>
                <td>보기</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
            </tr>
          )}
        </tbody>

      </Table>
    </Container>
  )
}

const Container = styled.div`
  background-color: var(--trai-white);
  padding: 20px;
  margin: 20px;
  border-radius: 20px;
`

const HiddenDateInput = styled.input`
  border: none;
  font-size: 16px;
  background-color: transparent;
  cursor: pointer;
  outline: none;
  appearance: none;
  &::-webkit-calendar-picker-indicator {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 12px;
    text-align: left;
  }

  th {
    color: var(--trai-greytext);
    font-size: 14px;
    border-bottom: 2px solid var(--trai-disabled);
  }

  td {
    color: var(--trai-text);
    font-size: 14px;
  }
`;

const ActionLabel = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60px;
  height: 30px;
  border-radius: 5px;
  font-weight: bold;
  font-size: 14px;
  color: white;

  ${({ type }) =>
    type === "sell" && `
      background-color: var(--trai-sell);
    `}
  
  ${({ type }) =>
    type === "buy" && `
      background-color: var(--trai-buy);
    `}
  
  ${({ type }) =>
    type === "hold" && `
      background-color: var(--trai-disabled);
    `}
`;

export default DailyTradeHistory;