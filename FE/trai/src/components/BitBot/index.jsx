import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import data from '@data/bitbotData.json';


import { IoCloseCircleOutline } from "react-icons/io5";

const BitbotModal = ({ onClose }) => {

  const [currentStep, setCurrentStep] = useState(data.root);
  const [history, setHistory] = useState([]);
  const [backStack, setBackStack] = useState([]);

  useEffect(()=> {
    setHistory([]);
    setBackStack([]);
  }, []);

  const handleOptionClick = (option) => {
    const newHistoryItem = {
      question: currentStep.question,
      answer: option.answer || null,
      selectedOption: option.label,
    };

    setHistory([...history, newHistoryItem]);
    setBackStack([...backStack, currentStep]);

    if(option.next) {
      setCurrentStep(data[option.next]);
    } else if(option.answer) {
      setCurrentStep({
        question: null,
        answer: option.answer,
        options:[]
      })
    }
  }

  const handleReset = () => {
    setCurrentStep(data.root);
    setBackStack([]);
  };

  const handleBack = () => {
    if(history.length > 0){
      const previousStep = backStack[backStack.length-1];
      setBackStack(backStack.slice(0,-1));
      setCurrentStep(previousStep);
    }
  };

   return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><IoCloseCircleOutline /></CloseButton>

        <HistoryContainer>
          {history.map((item, index) => (
            <HistoryItem key={index}>
              <div className='flex gap-2 items-center'>
                <div className='bg-trai-mint w-[14px] h-[14px] rounded-full'></div>
                <Question>{item.question}</Question>
              </div>
              <SelectedOption>{item.selectedOption}</SelectedOption>
              {item.answer && (
                <div className='flex gap-2 items-center'>
                  {/* 찌그러짐 이슈 <div className='bg-trai-mint w-[14px] h-[14px] rounded-full'></div> */}
                  <Answer>{item.answer}</Answer>
                </div>
              )}
            </HistoryItem>
          ))}
        </HistoryContainer>

        <div className='mt-2 p-2'>
          {!currentStep.answer && (
            <div className='flex gap-2 items-center mt-1 mb-3'>
              <p className='bg-trai-mint w-[14px] h-[14px] rounded-full'></p>
              <Question>{currentStep.question}</Question>
            </div>
          )}
          {/* {currentStep.answer && (
            <Answer>{currentStep.answer}</Answer>
          )} */}
          <Options>
            {currentStep.options.map((option, index) => (
              <OptionButton key={index} onClick={()=> handleOptionClick(option)}>
                {option.label}
              </OptionButton>
            ))}
          </Options>

          <div className='flex gap-2 mt-4'>
            <ControlButton onClick={handleBack} disabled={backStack.length === 0}>
              뒤로가기
            </ControlButton>
            <ControlButton onClick={handleReset}>
              처음으로
            </ControlButton>
          </div>
        </div>
      </ModalContainer>
    </ModalOverlay>
  )

}

BitbotModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 19%;
  left: 22%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  padding: 20px;
  border-radius: 20px;
  width: 400px;
  height: 600px;
  display: flex;
  box-shadow: 3px 3px 10px var(--trai-disabled);
  position: relative;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: var(--trai-mint);
  border: none;
  font-size: 32px;
  position: absolute;
  top: 15px;
  right: 15px;
  margin-bottom: 20px;
  cursor: pointer;
`;

const HistoryContainer = styled.div`
  margin: 30px 10px 10px;
  max-height: 500px;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--trai-mint);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--trai-disabled);
  }
`;

const HistoryItem = styled.div`
  margin-bottom: 8px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Question = styled.div`
  font-size: 16px;
`

const Answer = styled.div`
  font-size: 16px;
  background-color: var(--trai-disabled);
  padding: 7px;
  border-radius: 10px;
`;

const SelectedOption = styled.div`
  background-color: var(--trai-mint);
  color: var(--trai-white);
  display: inline-block;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 20px;
  max-width: fit-content;
  align-self: flex-end;
`;

const Options = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;

`

const OptionButton = styled.button`
  border: 1px solid var(--trai-mint);
  color: var(--trai-mint);
  padding: 5px 10px;
  border-radius: 20px;
`

const ControlButton = styled.button`
  background-color: var(--trai-mint);
  color: var(--trai-white);
  border-radius: 20px;
  padding: 5px 10px;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    background-color: var(--trai-disabled);
  }
`

export default BitbotModal;