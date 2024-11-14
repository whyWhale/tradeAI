import { useState } from 'react';

import styled from "styled-components";
import PropTypes  from "prop-types";

import { ImEnlarge2 } from "react-icons/im";

const PatternAgent = ({ className, patternData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }


  // 패턴 번호에 따라 이미지 소스 설정
  const patternNumber = String(patternData?.pattern_num).replace(/\D/g, '').padStart(2, '0');
  const patternImageSrc = `/images/${patternNumber}_pattern.png`;


  return(
    <div className={className}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-[16px] font-bold'>차트 패턴 분석</h1>
        <MoreButton onClick={handleMoreClick}><ImEnlarge2 /></MoreButton>
      </div>
      <div className="flex justify-center">
          <PatternImage src={patternImageSrc} alt="pattern image"/>
      </div>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col'>
              <h2 className="font-bold text-[20px]">Pattern Agent</h2>
              <div className='font-bold text-[32px]'>{patternData?.decision}</div>
              <div className='flex justify-center my-4'>
                <ChartImage
                  className="max-w-full max-h-[400px] object-contain"
                  src={patternData?.image_base64}
                  alt="chart_image"
                />
              </div>

              <div>{patternData?.summary}</div>
              <CloseButton onClick={handleCloseModal}>close</CloseButton>
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
  padding: 5px;
  max-width: 80%;
  height: auto;
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
  background-color: var(--trai-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  background-color: var(--trai-white);
  color: black;
  padding: 30px;
  border-radius: 10px;
  max-width: 1200px;
  height: 700px;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  font-size: 16px;
  bottom: 20px;
  right: 20px;
  width: 100px;
  height: 40px;
  color: var(--trai-white);
  background-color: var(--trai-navy);
  cursor: pointer;
`