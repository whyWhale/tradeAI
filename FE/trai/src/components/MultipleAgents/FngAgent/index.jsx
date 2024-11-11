import { useState } from 'react';

import styled from "styled-components";
import PropTypes from "prop-types";

import { ImEnlarge2 } from "react-icons/im";

const FngAgent = ({ className, fngData, selectedDate }) => {

  const [ isModalOpen, setIsModalOpen] = useState(false);
  const formattedDate = selectedDate.replace(/-/g, "-");

  const handleMoreClick = () => {
    setIsModalOpen(true);
  } 

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <div className={className}>
      <div className='flex justify-between items-center mb-4'>
        <h1 className="text-[16px] font-bold ">공포 탐욕 지수</h1>
        {fngData && (
          <MoreButton onClick={handleMoreClick}><ImEnlarge2 /></MoreButton>
        )}
      </div>
      <div className='flex justify-center'>
        <GraphImg><img src={`https://alternative.me/images/fng/crypto-fear-and-greed-index-${formattedDate}.png`} alt="fngImage" /></GraphImg>
      </div>
      


      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col'>
              <h2 className="font-bold text-[20px]">FNG Agent</h2>
              <div className='flex justify-center'>
                <GraphImg2><img src={`https://alternative.me/images/fng/crypto-fear-and-greed-index-${formattedDate}.png`} alt="fngImage" /></GraphImg2>
              </div>
              <div className='font-bold text-[32px]'>{fngData?.decision}</div>
              <div>{fngData?.summary}</div>
              <CloseButton onClick={handleCloseModal}>close</CloseButton>

            </div>
          </ModalContent>
        </ModalOverlay>
      )}  
    </div>
  )
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
  background-color: var(--trai-background);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  background-color: var(--trai-white);
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

const GraphImg = styled.div`
  width: 150px;
  height: 150px;
`

const GraphImg2 = styled.div`
  height: 400px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`