import { useState } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";

import { IoMdCloseCircle } from "react-icons/io";

const NewsAgent = ({ className, newsData }) => {
  const [ isModalOpen, setIsModalOpen] = useState(false);

  const handleMoreClick = () => {
    setIsModalOpen(true);
  }
  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return(
    <div className={className}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-[16px] font-bold ">최신 뉴스 반영</h1>
          {/* 더보기 버튼 */}
          {newsData?.sources.length > 5 && (
            <MoreButton onClick={handleMoreClick}>더보기</MoreButton>
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
            <div className="flex gap-12">
              <div className="w-[400px] flex flex-col h-full justify-between">
                <h2 className="font-bold text-[20px]">News Agent</h2>
                <div className="flex flex-col">
                  <div className="text-[60px] mb-10">{newsData.decision}</div>
                  <div>{newsData.summary}</div>
                </div>
              </div>
              <div>
                {newsData.sources.map((news, index) => (
                  <ModalNewsItem key={index}>
                    <a 
                      href={news.url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="flex gap-8 p-8 w-full h-[32px] items-center hover:bg-trai-navy hover:text-trai-white"
                    >
                      <p className="text-[28px]">{index+1}</p>
                      <p className="text-[20px]">{news.title}</p>
                    </a>
                  </ModalNewsItem>
                ))}
              </div>
            <CloseButton onClick={handleCloseModal}>페이지로 돌아가기</CloseButton>
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
  font-size: 12px;
  a {
    color: var(--trai-greytext);
    text-decoration: none;
  }
`

const MoreButton = styled.button`
  font-size: 12px;
  color: var(--trai-text);
  cursorL pointer;
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
  width: 1200px;
  height: 700px;
  overflow-y: auto;
  position: relative;
`

const CloseButton = styled.button`
  position: absolute;
  font-size: 16px;
  bottom: 20px;
  right: 20px;
  width: 180px;
  height: 40px;
  color: var(--trai-white);
  background-color: var(--trai-navy);
  cursor: pointer;
`

const ModalNewsItem = styled.div`
  margin: 8px 0;
  a {
    color: var(--trai-text);
    text-decoration: none;
  }
`