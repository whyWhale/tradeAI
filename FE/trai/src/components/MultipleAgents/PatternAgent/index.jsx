import { useState, useEffect } from 'react';
import styled from "styled-components";
import PropTypes  from "prop-types";

import { FaPlus } from "react-icons/fa6";
import { IoCloseCircleOutline } from "react-icons/io5"; 


const PatternAgent = ({ className, patternData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
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

  // 패턴 번호에 따라 이미지 소스 설정
  const patternNumber = String(patternData?.pattern_num).replace(/\D/g, '').padStart(2, '0');
  const patternImageSrc = `/images/${patternNumber}_pattern.png`;


  return(
    <div className={className}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-[16px] font-bold'>차트 패턴 분석</h1>
        <MoreButton onClick={handleMoreClick}><FaPlus /></MoreButton>
      </div>
      <div className="flex justify-center">
          <PatternImage src={patternImageSrc} alt="pattern image"/>
      </div>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col'>
              <h2 className="font-bold text-[32px]">차트 패턴 분석</h2>
              <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline /></CloseButton>
              <div className='flex justify-center my-4'>
                {patternData?.image_base64 ? (
                  <ChartImage
                    className="max-w-full max-h-[400px] object-contain"
                    src={patternData.image_base64}
                    alt="chart_image"
                  />
                ) : (
                  <StyledText>저장된 이미지가 없습니다</StyledText>
                )}
              </div>
              <SummaryContainer>
                <DecisionText decision={patternData?.decision}>
                  {patternData?.decision}
                </DecisionText>
                <SummaryContent>{patternData?.summary}</SummaryContent>
              </SummaryContainer>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}  

    </div>
  )
}

PatternAgent.propTypes = {
  className: PropTypes.string,
  patternData: PropTypes.shape({
    decision: PropTypes.string,
    pattern_num: PropTypes.number,
    summary: PropTypes.string,
    image_base64: PropTypes.string,
  }).isRequired,
}

export default PatternAgent;

const PatternImage = styled.img`
  max-width: 80%;
`

const ChartImage = styled.img`
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  width: 80%; /* 화면 너비의 80%로 설정 */
  max-width: 1366px; /* 이미지의 최대 너비를 원본 크기로 제한 */
  height: auto; /* 비율 유지 */
  object-fit: contain;
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
`

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

const SummaryContainer = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  padding: 0 75px;
  border-radius: 8px;
  margin-top: 5px;
  line-height: 36px;
  max-height: 200px;
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