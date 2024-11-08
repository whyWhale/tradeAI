import { NavLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { instance } from '@api/axios';
import { useDispatch } from "react-redux";
import { clearToken } from "@store/reducers/authSlice.jsx";

import { IoMdHelpCircleOutline } from 'react-icons/io';
import { VscSettings } from 'react-icons/vsc';
import { PiChartLineUpLight, PiHeadCircuit } from 'react-icons/pi';
import { MdCurrencyBitcoin, MdOutlineLogout } from 'react-icons/md';

const NavBar = ({openModal}) => {

  let navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await instance.post('/api/users/logout', null, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                dispatch(clearToken());
                navigate("/login");
            }

        } catch (error) {
            console.error("Logout error:", error);
        }
    };


  return (
    <div className="flex flex-col items-center">
      <LogoArea to="/">
        <div>로고</div>
        <p>T R A I</p>
      </LogoArea>

      <NavContainer>
        <NavList>
          <StyledNavLink to="/trade-settings">
            <div className="PageIcon"><VscSettings /></div>
            <div className="PageName">거래 설정</div>
          </StyledNavLink>
          <StyledNavLink to="/asset-overview">
            <div className="PageIcon"><PiChartLineUpLight /></div>
            <div className="PageName">자산 현황</div>
          </StyledNavLink>
          <StyledNavLink to="/investment-status">
            <div className="PageIcon"><MdCurrencyBitcoin /></div>
            <div className="PageName">투자 현황</div>
          </StyledNavLink>
          <StyledNavLink to="/trade-details">
            <div className="PageIcon"><PiHeadCircuit /></div>
            <div className="PageName">거래 상세 및 전략</div>
          </StyledNavLink>
          <StyledLogoutButton onClick={handleLogout}>
            <div className="PageIcon"><MdOutlineLogout /></div>
            <div className="PageName">로그아웃</div>
          </StyledLogoutButton>
        </NavList>
      </NavContainer>

      <BotArea>
        <div className="text-trai-white text-[24px] p-2"><IoMdHelpCircleOutline /></div>
        <div className="text-trai-white text-[16px] ml-2">도움이 필요하신가요?</div>
        <div className="text-trai-white text-[12px] ml-2 mb-2">아래의 버튼을 눌러 확인해보세요.</div>
        <BotButton onClick={openModal}>BitBot에게 물어보기</BotButton>
      </BotArea>
    </div>
  );
};

NavBar.propTypes = {
  openModal: PropTypes.func.isRequired,
}

const StyledNavLink = styled(NavLink)`
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 3px;
  padding: 8px 10px;
  text-decoration: none;
  border-radius: 15px;
  background-color: transparent;
  border: 1px solid transparent;
  
  &.active {
    background-color: var(--trai-white);
    box-shadow: 3px 3px 3px var(--trai-disabled);

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
    font-size: 24px;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 2px 2px 2px var(--trai-disabled);
  }

  .PageName {
    color: var(--trai-greytext);
  }
`;


const StyledLogoutButton = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
  margin: 3px;
  margin-top: 20px;
  padding: 8px 10px;
  border-radius: 15px;
  background-color: transparent;
  cursor: pointer;

  .PageIcon {
    background-color: var(--trai-white);
    color: var(--trai-mint);
    font-size: 24px;
    padding: 8px;
    border-radius: 10px;
    box-shadow: 2px 2px 2px var(--trai-disabled);
  }

  .PageName {
    color: var(--trai-greytext);
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;


const LogoArea = styled(NavLink)`
  display: flex;
  padding: 10px;
  margin: 20px auto; 
  font-size: 20px;
  border-bottom: 1px var(--trai-disabled) solid;
`;

const NavContainer = styled.div``;

const NavList = styled.ul`
  margin: 10px;
`;

const BotArea = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--trai-mint);
  border-radius: 20px;
  width: 220px;
  height: 180px;
  padding: 8px;
  margin-top: 20px;
`;

const BotButton = styled.button`
  background-color: var(--trai-white);
  color: var(--trai-mint);
  border-radius: 10px;
  width: 190px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px auto;
  border: 1px solid #e8e8e8;
  transition: all 0.2s;
  box-shadow: 6px 6px 12px rgba(0, 128, 128, 0.2), -3px -3px 6px rgba(255, 255, 255, 0.3);

  &:active {
    box-shadow: inset 4px 4px 12px rgba(0, 128, 128, 0.3), inset -4px -4px 12px rgba(255, 255, 255, 0.7);
  }
`;



export default NavBar;
