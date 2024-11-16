import { useState, useEffect } from 'react';
import styled from "styled-components";
import PropTypes from "prop-types";
import { IoCloseCircleOutline } from "react-icons/io5"; 
import { FaPlus } from "react-icons/fa6";

const NewsAgent = ({ className, newsData }) => {
  const [ isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  // 모달이 열릴 때 배경 스크롤 비활성화
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isModalOpen]);
  
  return(
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[16px] font-bold ">최신 뉴스 반영</h1>
          {/* 더보기 버튼 */}
          {newsData?.sources.length > 0 && (
            <MoreButton onClick={handleMoreClick}><FaPlus/></MoreButton>
          )} 
      </div>

      {/* 뉴스 리스트 (5개만 보임) */}
      <NewsList>
        {newsData?.sources.slice(0,5).map((news,index) => (
          <NewsItem key={index}>
            <a href={news.url} target="_blank" rel="noopener noreferrer">
              {news.title}
            </a>
          </NewsItem>
        ))}
      </NewsList>

      {isModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <div className="flex flex-col">
              <div className="flex flex-col justify-between">
                <h2 className="font-bold text-[32px] pb-[40px]">최신 뉴스 반영</h2>
                <CloseButton onClick={handleCloseModal}><IoCloseCircleOutline /></CloseButton>
                {/* <div className="flex flex-col">
                  <div className="text-[60px] mb-10">{newsData.decision}</div>
                  <div className="mb-10">{newsData.summary}</div>
                </div> */}
                <SummaryContainer>
                <DecisionText decision={newsData?.decision}>
                  {newsData?.decision}
                </DecisionText>
                <SummaryContent>{newsData?.summary}</SummaryContent>
              </SummaryContainer>
              </div>
              <ModalNewsContainer>
                {newsData.sources.map((news, index) => (
                  <ModalNewsItem key={index}>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex gap-8 p-6 w-full h-[28px] items-center hover:bg-trai-navy hover:text-trai-white"
                    >
                      <p className="text-[25px] font-bold">{index+1}</p>
                      <p className="text-[18px] font-bold">{news.title}</p>
                    </a>
                  </ModalNewsItem>
                ))}
                <div className='h-[20px]'></div>
              </ModalNewsContainer>
            {/* <CloseButton onClick={handleCloseModal}>페이지로 돌아가기</CloseButton> */}
            </div>
          </ModalContent>
        </ModalOverlay>
      )}


    </div>
  )
}

NewsAgent.propTypes = {
  className: PropTypes.string,
  newsData: PropTypes.shape({
    summary: PropTypes.string,
    decision: PropTypes.string,
    sources: PropTypes.arrayOf(
      PropTypes.shape({
        title: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      })
    ),
  }).isRequired,
}

export default NewsAgent;

const NewsList = styled.ul`
  list-style: none;
  padding: 0;
`

const NewsItem = styled.li`
  margin: 5px 0;
  font-size: 14px;
  a {
    color: var(--trai-text);
    text-decoration: none;
  }
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
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  background-color: var(--trai-white);
  color: var(--trai-text);
  padding: 30px 40px 30px 30px;
  border-radius: 10px;
  width: 800px;
  height: 550px; 
  position: relative;
  overflow-y: auto;
  box-sizing: content-box;
  padding-right: 20px;

  &::-webkit-scrollbar {
    width: 8px;
    margin-right: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: var(--trai-navy);
    border: 2px solid var(--trai-white);
  }

  &::-webkit-scrollbar-track {
    border-radius: 10px;
    background-color: var(--trai-disabled);
    margin: 10px 0;
    border: 4px solid var(--trai-white);
  }
`


const SummaryContainer = styled.div`
  font-size: 18px;
  font-weight: 500;
  color: #333;
  padding: 0 75px;
  border-radius: 8px;
  margin-top: 5px;
  margin-bottom: 15px;
  line-height: 36px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const SummaryContent = styled.span`
  font-size: 18px;
  line-height: 36px;
  color: #333;
`;

const DecisionText = styled.div`
  font-weight: bold;
  font-size: 32px;
  color: ${({ decision }) => {
    switch (decision) {
      case 'BUY':
        return 'var(--trai-buy)';
      case 'SELL':
        return 'var(--trai-sell)';
      case 'HOLD':
        return 'gray';
      default:
        return 'black';
    }
  }};
  margin-bottom: 10px;
`


const ModalNewsContainer = styled.div`
  width: 80%;
  padding: 0 8px;
  max-height: 300px;
  border-radius: 8px;
  margin: 0 auto;
`;

const ModalNewsItem = styled.div`
  margin: 15px 0;
  border-left: 5px solid var(--trai-navy);
  a {
    color: var(--trai-text);
    text-decoration: none;
  }

  &:last-child {
    margin-bottom: 20px !important;
  }
`

const CloseButton = styled.button`
  position: absolute;
  font-size: 32px;
  top: 20px;
  right: 20px;
  color: var(--trai-navy);
  cursor: pointer;
`