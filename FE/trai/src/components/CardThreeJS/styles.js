import styled from 'styled-components';

export const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 500px;
`;

export const ButtonContainer = styled.div`
  position: absolute;
  bottom: 64px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
`;

export const ColorButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  margin-left: 16px;
  cursor: pointer;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  &:first-child {
    margin-left: 0;
  }

  &:hover {
    transform: scale(1.1);
    transition: transform 0.2s ease-in-out;
  }
`;