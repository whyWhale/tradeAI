import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { IoMdHelpCircleOutline } from 'react-icons/io';
import { VscSettings } from 'react-icons/vsc';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { PiChartLineUpLight, PiHeadCircuit } from 'react-icons/pi';
import { MdCurrencyBitcoin, MdOutlineLogout } from 'react-icons/md';

const NavBar = ({openModal}) => {

  return (
    <div className="flex flex-col items-center">
      <LogoArea>
        <div>로고</div>
        <p>T R A I</p>
      </LogoArea>

      <NavContainer>
        <NavList>
          <StyledNavLink to="/trade-settings">
            <div className="PageIcon"><VscSettings /></div>
            <div className="PageName">거래 설정 페이지</div>
          </StyledNavLink>
          <StyledNavLink to="/asset-overview">
            <div className="PageIcon"><PiChartLineUpLight /></div>
            <div className="PageName">자산 현황 페이지</div>
          </StyledNavLink>
          <StyledNavLink to="/investment-status">
            <div className="PageIcon"><MdCurrencyBitcoin /></div>
            <div className="PageName">투자 현황 페이지</div>
          </StyledNavLink>
          <StyledNavLink to="/trade-details">
            <div className="PageIcon"><IoDocumentTextOutline /></div>
            <div className="PageName">거래 내역 상세 페이지</div>
          </StyledNavLink>
          <StyledNavLink to="/strategy">
            <div className="PageIcon"><PiHeadCircuit /></div>
            <div className="PageName">투자 전략 페이지</div>
          </StyledNavLink>
          <StyledNavLink to="/logout">
            <div className="PageIcon"><MdOutlineLogout /></div>
            <div className="PageName">로그아웃</div>
          </StyledNavLink>
        </NavList>
      </NavContainer>

      <BotArea>
        <div className="text-trai-white text-[24px] p-2"><IoMdHelpCircleOutline /></div>
        <div className="text-trai-white text-[16px] ml-2">도움이 필요하신가요?</div>
        <div className="text-trai-white text-[12px] ml-2">아래의 버튼을 눌러 확인해보세요.</div>
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

const LogoArea = styled.div`
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
  width: 240px;
  height: 180px;
  padding: 10px;
  margin-top: 20px;
`;

const BotButton = styled.button`
  background-color: var(--trai-white);
  color: var(--trai-mint);
  border-radius: 10px;
  width: 210px;
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
