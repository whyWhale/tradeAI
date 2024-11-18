import { useState, useEffect } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";

import { FaPlus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5"; 

const FngAgent = ({ className, fngData, selectedDate }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(true);
  const formattedDate = selectedDate.replace(/-/g, "-");

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  const handleImageError = () => {
    setIsImageLoaded(false);
  }

  // 모달이 열릴 때 배경 스크롤 비활성화
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);

  return (
    <div className={className}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-[16px] font-bold ">공포 탐욕 지수</h1>
        {fngData && (
          <MoreButton onClick={handleMoreClick}><FaPlus /></MoreButton>
        )}
      </div>
      <div className="flex justify-center">
        {fngData && isImageLoaded ? (
          <GraphImg>
            <img
              src={`https://alternative.me/images/fng/crypto-fear-and-greed-index-${formattedDate}.png`}
              alt="fngImage"
              onError={handleImageError} 
            />
          </GraphImg>
        ) : (
          <p className='mt-[80px] text-[14px]'>업데이트 중입니다.</p> 
        )}
      </div>


      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col'>
              <h2 className="font-bold text-[32px]">공포 탐욕 지수</h2>
              <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline /></CloseButton>
              <div className='flex justify-center'>
                {fngData && isImageLoaded ? (
                  <GraphImg2>
                    <img
                      src={`https://alternative.me/images/fng/crypto-fear-and-greed-index-${formattedDate}.png`}
                      alt="fngImage"
                      
                    />
                  </GraphImg2>
                ) : (
                  <StyledText>저장된 이미지가 없습니다</StyledText>
                )}
              </div>

              <SummaryContainer>
                <DecisionText decision={fngData?.decision}>
                  {fngData?.decision}
                </DecisionText>
                <SummaryContent>{fngData?.summary}</SummaryContent>
              </SummaryContainer>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
}

FngAgent.propTypes = {
  className: PropTypes.string,
  fngData: PropTypes.shape({
    decision: PropTypes.string,
    summary: PropTypes.string,
  }).isRequired,
  selectedDate: PropTypes.string.isRequired,
}

export default FngAgent;

const MoreButton = styled.button`
  font-size: 16px;
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

const StyledText = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 80%; /* ChartImage와 동일한 너비 */
  max-width: 1366px; /* 최대 너비 제한 */
  height: 400px;
  font-size: 16px;
  color: #666;
  background-color: #f9f9f9;
  text-align: center;
  margin-top: 50px;
  margin-bottom: 30px;
`

const SummaryContainer = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  padding: 0 75px;
  border-radius: 8px;
  margin-top: 5px;
  line-height: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const DecisionText = styled.div`
  font-weight: bold;
  font-size: 32px;
  color: ${({ decision }) => {
    switch (decision) {
      case 'BUY':
        return 'var(--trai-buy)';
      case 'SELL':
        return 'var(--trai-sell)';
      case 'HOLD':
        return 'gray';
      default:
        return 'black';
    }
  }};
  margin-bottom: 10px;
`

const SummaryContent = styled.span`
  font-size: 18px;
  line-height: 36px;
  color: #333;
`;

const GraphImg = styled.div`
  width: 250px;
  height: 200px;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center top;
  }
`

const GraphImg2 = styled.div`
  padding: 10px;
  height: 400px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`
