import { useState } from 'react';
import { instance } from '@api/axios';
import PropTypes from 'prop-types';
import { useDispatch } from "react-redux";
import { NavLink, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { IoMdHelpCircleOutline } from 'react-icons/io';
import { MdCurrencyBitcoin, MdOutlineLogout } from 'react-icons/md';
import { PiChartLineUpLight, PiHeadCircuit } from 'react-icons/pi';
import { VscSettings } from 'react-icons/vsc';
import logo from '@assets/logo/trai_logo_x.png';

const NavBar = ({openModal}) => {

  let navigate = useNavigate();
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

  const openLogoutModal = () => setIsModalOpen(true);
  const closeLogoutModal = () => setIsModalOpen(false);

  return (
    <NavWrapper>
      <LogoArea to="/" className="flex flex-col items-center">
      <img src={logo} alt="Logo" className="w-24 h-auto" />
      </LogoArea>

      <NavContainer>
        <NavList>
          <StyledNavLink to="/trade-settings">
            <div className="PageIcon"><VscSettings /></div>
            <div className="PageName">투자 성향 설정</div>
          </StyledNavLink>
          <StyledNavLink to="/asset-overview">
            <div className="PageIcon"><PiChartLineUpLight /></div>
            <div className="PageName">자산 현황</div>
          </StyledNavLink>
          <StyledNavLink to="/investment-status">
            <div className="PageIcon"><MdCurrencyBitcoin /></div>
            <div className="PageName">투자 내역</div>
          </StyledNavLink>
          <StyledNavLink to="/trade-details">
            <div className="PageIcon"><PiHeadCircuit /></div>
            <div className="PageName">거래 상세 및 전략</div>
          </StyledNavLink>
          <StyledLogoutButton onClick={openLogoutModal}>
            <div className="PageIcon"><MdOutlineLogout /></div>
            <div className="PageName">로그아웃</div>
          </StyledLogoutButton>
        </NavList>
      </NavContainer>

      <BotArea>
        <div className="text-trai-white text-[2vw] p-2"><IoMdHelpCircleOutline /></div>
        <div className="text-trai-white text-[1vw] ml-2">도움이 필요하신가요?</div>
        <div className="text-trai-white text-[0.8vw] ml-2 mb-2">아래의 버튼을 눌러 확인해보세요.</div>
        <BotButton onClick={openModal}>BitBot에게 물어보기</BotButton>
      </BotArea>

      {isModalOpen && (
        <ModalOverlay onClick={closeLogoutModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <p>정말 로그아웃하시겠습니까?</p>
            <ModalButtonContainer>
              <ConfirmButton onClick={handleLogout}>확인</ConfirmButton>
              <CancelButton onClick={closeLogoutModal}>취소</CancelButton>
            </ModalButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </NavWrapper>
  );
};

NavBar.propTypes = {
  openModal: PropTypes.func.isRequired,
}

const NavWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: space-between; /* 하단 고정을 위해 추가 */
`;

const StyledNavLink = styled(NavLink)`
  display: flex;
  gap: 2vw;
  align-items: center;
  margin: 0.2vw;
  padding: 1vh 1.2vw;
  text-decoration: none;
  border-radius: 1vw;
  background-color: transparent;
  border: 1px solid transparent;
  
  &.active {
    background-color: var(--trai-white);
    box-shadow: 0.2vw 0.2vw 0.2vw var(--trai-disabled);

    .PageIcon {
      background-color: var(--trai-mint);
      color: var(--trai-white);
    }

    .PageName {
      color: var(--trai-text);
    }
  }

  .PageIcon {
    background-color: var(--trai-white);
    color: var(--trai-mint);
    font-size: 2vw;
    padding: 1vh;
    border-radius: 1vw;
    box-shadow: 0.15vw 0.15vw 0.15vw var(--trai-disabled);
  }

  .PageName {
    color: var(--trai-greytext);
  }
`;

const StyledLogoutButton = styled.div`
  display: flex;
  gap: 2vw;
  align-items: center;
  margin: 0.2vw;
  padding: 1vh 1.2vw;
  border-radius: 1vw;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s;

  .PageIcon {
    background-color: var(--trai-white);
    color: var(--trai-mint);
    font-size: 2vw;
    padding: 1vh;
    border-radius: 1vw;
    box-shadow: 0.15vw 0.15vw 0.15vw var(--trai-disabled);
  }

  .PageName {
    color: var(--trai-greytext);
  }

  &:hover {
    background-color: rgba(0, 128, 128, 0.1); /* 배경 색으로 hover 반응 범위를 넓힘 */
  }
`;

const LogoArea = styled(NavLink)`
  display: flex;
  padding: 1vh;
  margin: 2vh auto; 
  font-size: 2vw;
  border-bottom: 0.1vw var(--trai-disabled) solid;
`;

const NavContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2vh;
`;

const NavList = styled.ul`
  margin: 1vh;
`;

const BotArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--trai-mint);
  border-radius: 1vw;
  width: 15vw;
  max-width: 300px;
  padding: 1vh;
  margin-bottom: 2vh; /* 하단 여백 추가 */
`;

const BotButton = styled.button`
  background-color: var(--trai-white);
  color: var(--trai-mint);
  border-radius: 0.7vw;
  width: 100%;
  height: 7vh;
  max-height: 60px;
  font-size: 2vh;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 1vh;
  border: 0.1vw solid #e8e8e8;
  transition: all 0.2s;
  box-shadow: 0.4vw 0.4vw 0.8vw rgba(0, 128, 128, 0.2), -0.2vw -0.2vw 0.4vw rgba(255, 255, 255, 0.3);

  &:active {
    box-shadow: inset 0.3vw 0.3vw 0.8vw rgba(0, 128, 128, 0.3), inset -0.3vw -0.3vw 0.8vw rgba(255, 255, 255, 0.7);
  }
`;
// 모달 스타일 정의
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
export default NavBar;
