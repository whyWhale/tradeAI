import styled from "styled-components";

const ChartButton = styled.button`
  background-color: #FFFFFF !important; // 기본 배경색 설정
  color: #4FD1C5 !important;
  border-radius: 0.3vw !important;
  width: 6vw !important;
  height: 3vh !important;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 0.5vw;
  border: 0.1vw solid #e8e8e8 !important;
  font-size: 0.8vw !important;
  transition: all 0.2s;
  box-shadow: 0.5vw 0.5vw 1vw rgba(0, 128, 128, 0.2), -0.3vw -0.3vw 0.6vw rgba(255, 255, 255, 0.3) !important;
  cursor: pointer;
  appearance: none; // 브라우저 기본 스타일 초기화
  outline: none; // 클릭 시 파란색 아웃라인 제거

  &:hover {
    background-color: rgba(79, 209, 197, 0.2) !important;
  }

  &:active,
  &.active {
    background-color: #4FD1C5 !important;
    color: #FFFFFF !important;
    box-shadow: inset 0.3vw 0.3vw 1vw rgba(0, 128, 128, 0.3), inset -0.3vw -0.3vw 1vw rgba(255, 255, 255, 0.7);
  }
`;

export default ChartButton;
