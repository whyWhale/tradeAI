import { useState } from 'react';

import styled from "styled-components";
import PropTypes  from "prop-types";

import { ImEnlarge2 } from "react-icons/im";

const QuantAgent = ({ className, quantData }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <div className={className}>
      <div className='flex justify-between'>
        <div>Quant Agent</div>
        <MoreButton onClick={handleMoreClick}><ImEnlarge2 /></MoreButton>
      </div>
      <div className='font-bold text-[32px] text-center mt-10 items-center'>{quantData?.decision}</div>


      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className='flex flex-col'>
              <h2 className="font-bold text-[20px]">Quant Agent</h2>
              <div className='font-bold text-[32px]'>{quantData?.decision}</div>
              <div>{quantData?.summary}</div>
              <CloseButton onClick={handleCloseModal}>close</CloseButton>

            </div>
          </ModalContent>
        </ModalOverlay>
      )}  

    </div>
  )
}

QuantAgent.propTypes = {
  className: PropTypes.string,
  quantData: PropTypes.shape({
    decision: PropTypes.string,
    summary: PropTypes.string,
  }).isRequired,
}

export default QuantAgent;

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