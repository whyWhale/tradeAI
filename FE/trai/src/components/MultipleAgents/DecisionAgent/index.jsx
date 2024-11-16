import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { FaPlus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5"; 

const DecisionAgent = ({ className, decisionData, portfolioData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <Container className={className}>
      <div className="flex justify-between">
        <h1 className="font-bold text-[16px] mr-2">종합 전략</h1>
        <MoreButton onClick={handleModalOpen}><FaPlus/></MoreButton>
      </div>
      {decisionData?.percentage !== undefined && (
        <div className="flex font-bold text-[72px] justify-evenly mt-10">
          <div>{decisionData?.decision}</div>
          {decisionData?.decision !== 'HOLD' && <div>{` ${decisionData?.percentage}%`}</div>}
        </div>
      )}
      {/* <div className="text-[14px]">{decisionData?.summary.slice(0, 100)}</div> */}

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className="flex justify-between items-centers">
              <h2 className="font-bold text-[32px] mb-8">종합 전략</h2>
              <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline /></CloseButton>
            </div>
            {decisionData?.percentage !== undefined && (
              <div>
                <div className="font-bold text-[24px] mb-5 pl-[75px]">최종 거래 판단: {decisionData?.decision}</div>
                <div className="text-[18px] text-justify leading-9 pl-[75px] pr-[75px]"> {decisionData?.summary}</div>
    
                <div className="font-bold text-[24px] mt-10 mb-5 pl-[75px]">거래 비율: {`${decisionData?.percentage}%`}</div>
              </div>
            )}
            <div className="text-[18px] text-justify leading-9 pl-[75px] pr-[75px]">{portfolioData?.summary}</div>
          </ModalContent>
        </ModalOverlay>
      )}

    </Container>
  )
}

DecisionAgent.propTypes = {
  className: PropTypes.string,
  decisionData: PropTypes.shape({
    decision: PropTypes.string,
    percentage: PropTypes.string,
    summary: PropTypes.string,
  }).isRequired,
  portfolioData: PropTypes.shape({
    percentage: PropTypes.string,
    summary: PropTypes.string,
  }).isRequired,
}

export default DecisionAgent;


// background: linear-gradient(180deg, var(--trai-sell), var(--trai-background));
const Container = styled.div`
`


const MoreButton = styled.button`
  font-size: 16px;
  color: var(--trai-white);
  cursor: pointer;
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

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
`

const CloseButton = styled.button`
  position: absolute;
  font-size: 32px;
  top: 20px;
  right: 20px;
  color: var(--trai-navy);
  cursor: pointer;
`