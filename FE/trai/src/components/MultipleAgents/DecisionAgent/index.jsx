import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { IoCloseCircleOutline } from "react-icons/io5"; 

const DecisionAgent = ({ className, decisionData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <Container className={className}>
      <h1 className="font-bold text-[16px] mr-2">종합 전략</h1>
      <MoreButton onClick={handleModalOpen}>더보기</MoreButton>
      <div
        className="font-bold text-[80px] mt-4 mb-2"
        // style={{
        //   color:
        //     decisionData?.decision === 'BUY'
        //       ? 'var(--trai-buy)'
        //       : decisionData?.decision === 'SELL'
        //       ? 'var(--trai-sell)'
        //       : 'var(--trai-text)',
        // }}
      >
        {decisionData?.decision}
      </div>
      {/* <div className="font-bold text-[100px] mt-4 mb-2">{decisionData?.percentage}</div> */}
      {/* <div className="text-[14px]">{decisionData?.summary.slice(0, 100)}</div> */}

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className="flex justify-between items-centers">
              <h2 className="font-bold text-[24px] mb-8">Decision Agent</h2>
              <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline /></CloseButton>
            </div>
            <div className="font-bold text-[20px] mb-5 pl-5">최종 거래 판단: {decisionData?.decision}</div>
            <div className="font-bold text-[20px] mb-5 pl-5">거래 비율: {decisionData?.percentage}</div>
            <div className="text-[18px] text-justify leading-9 pl-5 pr-5"> {decisionData?.summary}</div>
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
}

export default DecisionAgent;


// background: linear-gradient(180deg, var(--trai-sell), var(--trai-background));
const Container = styled.div`
`


const MoreButton = styled.button`
  font-size: 12px;
  color: var(--trai-text);
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
  padding: 30px;
  border-radius: 10px;
  width: 800px;
  height: 550px; 
  position: relative;
  overflow-y: auto;

  box-sizing: content-box;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--trai-navy);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--trai-disabled);
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