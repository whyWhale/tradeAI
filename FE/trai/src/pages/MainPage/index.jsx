import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const MainPage = () => {
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col items-center justify-center">
      <div className="text-3xl font-bold mb-8">메인 페이지입니다.</div>
      <div className="flex space-x-4">
        <StyledLink to={'/signup'} className="hover:bg-blue-500">
          회원가입
        </StyledLink>
        <StyledLink to={'/login'} className="hover:bg-blue-500">
          로그인
        </StyledLink>
        <StyledLink to={'/trade-settings'} className="hover:bg-blue-500">
          거래설정페이지
        </StyledLink>
        <StyledLink to={'/investment-status'} className="hover:bg-blue-500">
          투자현황페이지
        </StyledLink>
        <StyledLink to={'/asset-overview'} className="hover:bg-blue-500">
          자산현황페이지
        </StyledLink>
        <StyledLink to={'/trade-details'} className="hover:bg-blue-500">
          거래상세내역페이지
        </StyledLink>
      </div>
    </div>
  );
};

export default MainPage;

const StyledLink = styled(NavLink)`
  padding: 10px 20px;
  color: white;
  margin: 20px;
  background-color: pink;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  &:hover {
    color: blue;
  }
`;