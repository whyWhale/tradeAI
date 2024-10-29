import PropTypes from 'prop-types';
import styled from "styled-components";


import { IoCloseCircleOutline } from "react-icons/io5";

const BitbotModal = ({ onClose }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}><IoCloseCircleOutline /></CloseButton>
        <p>모달이지</p>
      </ModalContainer>
    </ModalOverlay>
  )

}

BitbotModal.propTypes = {
  onClose: PropTypes.func.isRequired,
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 300px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const CloseButton = styled.button`
  background-color: transparent;
  color: black;
  border: none;
  font-size: 24px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;


export default BitbotModal;