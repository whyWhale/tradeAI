import PropTypes from 'prop-types';
import styled from 'styled-components';

const Modal = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel' }) => {
  return (
    <Overlay>
      <ModalContainer>
        <Title>{title}</Title>
        <Message>{message}</Message>
        <ButtonContainer>
          <Button onClick={onConfirm} variant="confirm">
            {confirmText}
          </Button>
          <Button onClick={onCancel} variant="cancel">
            {cancelText}
          </Button>
        </ButtonContainer>
      </ModalContainer>
    </Overlay>
  );
};

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
};

export default Modal;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: var(--trai-white);
  border-radius: 8px;
  padding: 20px;
  width: 320px;
  max-width: 80%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  color: var(--trai-text);
`;

const Message = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  color: var(--trai-greytext);
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
`;

const Button = styled.button`
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  ${({ variant }) => variant === 'cancel' && `
    background-color: var(--trai-disabled);
    color: var(--trai-text);
  `}
  ${({ variant }) => variant === 'confirm' && `
    background-color: var(--trai-navy);
    color: var(--trai-white);
  `}
  &:hover {
    opacity: 0.9;
  }
`;
