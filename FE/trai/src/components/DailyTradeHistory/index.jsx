import { useState, useRef } from 'react';
import styled from "styled-components";

import { FaRegCalendarAlt } from "react-icons/fa";

const DailyTradeHistory = () => {

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const dateInputRef = useRef(null);

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    console.log(event.target.value);
  }

  const openDatePicker = () => {
    dateInputRef.current.showPicker();
  }

  return(
    <Container>
      <div className="flex gap-2 items-center mb-2">
        <FaRegCalendarAlt onClick={openDatePicker} className='text-[24px] text-trai-text'/>
        <HiddenDateInput
          ref={dateInputRef}
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="text-[20px]"
        />
      </div>
      
      <div className="flex gap-4">
        <p>날짜</p>
        <p>비트코인 시세</p>
        <p>평단가</p>
        <p>판단</p>
        <p>거래 금액</p>
        <p>총 평가</p>
        <p>총 보유자산</p>
      </div>
      
      <div className="border border-trai-greytext"></div>
      
      <div>
        <div className="flex gap-2">
          <p>2024.10.20 00:00:00</p>
          <p>91,890,000</p>
          <p>90,000,000</p>
          <p >sell</p>
          <p>918,900</p>
          <p>918,000</p>
          <p>918,900</p>
          <p>보기</p>
        </div>
      </div>
    </Container>
  )
}

const Container = styled.div`
  background-color: var(--trai-disabled);
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

export default DailyTradeHistory;