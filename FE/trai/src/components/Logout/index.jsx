import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { instance } from "@api/axios.js";
import styled from 'styled-components';

const LogoutButton = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const response = await instance.post('/api/users/logout', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                localStorage.removeItem('token');
                navigate("/login");
            }

        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <>
            <StyledButton onClick={openModal}>로그아웃</StyledButton>
            {isModalOpen && (
                <ModalOverlay onClick={closeModal}>
                    <ModalContent onClick={(e) => e.stopPropagation()}>
                        <p>정말 로그아웃하시겠습니까?</p>
                        <ModalButtonContainer>
                            <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
                            <CancelButton onClick={closeModal}>취소</CancelButton>
                        </ModalButtonContainer>
                    </ModalContent>
                </ModalOverlay>
            )}
        </>
    );
};

export default LogoutButton;

const StyledButton = styled.button`
    padding: 10px 20px;
    color: var(--trai-mint);
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: inline-block;
    background-color: transparent;

    &:hover {
        background-color: rgba(0, 128, 128, 0.1);
        font-weight: 600;
    }
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background: white;
    padding: 20px;
    border-radius: 8px;
    text-align: center;
    max-width: 300px;
    width: 100%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const ModalButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-top: 15px;
`;

const ConfirmButton = styled.button`
    padding: 8px 16px;
    background-color: var(--trai-mint);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        font-weight: 600;
        background-color: #45a29e; 
    }
`;

const CancelButton = styled.button`
    padding: 8px 16px;
    background-color: #ccc;
    color: #333;
    border: none;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
        font-weight: 600;
        background-color: #999;
    }
`;
