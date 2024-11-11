import { useState, useRef, useEffect } from 'react';
import styled from "styled-components";
import { instance } from '@api/axios';

import { FaRegCalendarAlt } from "react-icons/fa";

const DailyTradeHistory = () => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [tradeData, setTradeData] = useState([]);
  const dateInputRef = useRef(null);

  const formatDate = (isoString) => {
    const [date, time] = isoString.split("T");
    const formatTime = time.split(".")[0];
    return `${date} ${formatTime}`;
  }

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
        console.log(response.data);
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
                <td>{formatDate(data.orderCreatedAt)}</td>
                <td>{data.price}</td>
                <td>{data.averagePrice}</td>
                <td><ActionLabel type={data.side}>{data.side ? data.side.toUpperCase() : 'N/A'}</ActionLabel></td>
                <td>{data.executedFunds}</td>
                <td>{data.totalEvaluation}</td>
                <td>{data.totalAmount}</td>
                <td>회고</td>
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

  tbody {
    display: block;
    max-height: 300px;
    overflow-y: auto;
    width: 100%;

      &::-webkit-scrollbar {
        margin-top: 10px;
        width: 12px;
      }
    
      &::-webkit-scrollbar-thumb {
        margin-top: 10px;
        border-radius: 8px;
        background-color: var(--trai-navy);
      }
    
      &::-webkit-scrollbar-track {
        margin-top: 10px;
        border-radius: 8px;
        background-color: var(--trai-disabled);
      }
  }

  thead, tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
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
    type === "SELL" && `
      background-color: var(--trai-sell);
    `}
  
  ${({ type }) =>
    type === "BUY" && `
      background-color: var(--trai-buy);
    `}
  
  ${({ type }) =>
    type === "HOLD" && `
      background-color: var(--trai-disabled);
    `}
`;

export default DailyTradeHistory;