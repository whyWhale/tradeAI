import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from "styled-components";
import data from '@data/bitbotData.json';


import { IoCloseCircleOutline } from "react-icons/io5";

const BitbotModal = ({ onClose }) => {

  const [currentStep, setCurrentStep] = useState(data.root);
  const [history, setHistory] = useState([]);

  useEffect(()=> {
    setHistory([]);
  }, []);

  const handleOptionClick = (option) => {
    const newHistoryItem = {
      question: currentStep.question,
      answer: option.answer || null,
      selectedOption: option.label,
    };

    setHistory([...history, newHistoryItem]);

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

   return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><IoCloseCircleOutline /></CloseButton>

        <HistoryContainer>
          {history.map((item, index) => (
            <HistoryItem key={index}>
              <Question>{item.question}</Question>
              <SelectedOption>{item.selectedOption}</SelectedOption>
              {item.answer && <Answer>{item.answer}</Answer>}
            </HistoryItem>
          ))}
        </HistoryContainer>

        <div className='mt-10 border border-black p-2'>
          {!currentStep.answer && (
            <div className='flex gap-2 items-center mt-1 mb-3'>
              <div className='bg-trai-mint w-[14px] h-[14px] rounded-full'></div>
              <Question>{currentStep.question}</Question>
            </div>
          )}
          {currentStep.answer && (
            <Answer>{currentStep.answer}</Answer>
          )}
          <Options>
            {currentStep.options.map((option, index) => (
              <OptionButton key={index} onClick={()=> handleOptionClick(option)}>
                {option.label}
              </OptionButton>
            ))}
          </Options>
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
  margin-top: 30px;
  max-height: 500px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const HistoryItem = styled.div`
  margin-bottom: 8px;
  gap: 10px;
  display: flex;
  flex-direction: column;
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
  display: flex;
  justify-content: end;
  font-size: 16px;
  padding: 5px 10px;
  border-radius: 20px;
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


export default BitbotModal;