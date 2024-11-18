import os
import requests
from datetime import datetime
from pydantic import BaseModel
from typing import List, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.utilities import SerpAPIWrapper
from core.config import llm
from core.state import State

# 뉴스 데이터 수집 함수
def get_news_data():
    """SERPAPI를 통해 Google News에서 비트코인 관련 뉴스 데이터를 수집하고, source에 따라 필터링하여 반환합니다."""
    url = f"https://serpapi.com/search.json?engine=google_news&q=btc&api_key={os.getenv('SERPAPI_API_KEY')}"
    simplified_news = []
    
    try:
        response = requests.get(url)
        news_results = response.json().get('news_results', [])
        
        for news_item in news_results:
            # Check if this news item contains 'stories'
            if 'stories' in news_item:
                for story in news_item['stories']:
                    timestamp = int(datetime.strptime(story['date'], '%m/%d/%Y, %H:%M %p, %z %Z').timestamp() * 1000)
                    simplified_news.append({
                        "title": story['title'],
                        "url": story.get('link', ''),
                        "source": story.get('source', {}).get('name', 'Unknown source'),
                        "timestamp": timestamp
                    })
            elif news_item.get('date'):
                timestamp = int(datetime.strptime(news_item['date'], '%m/%d/%Y, %H:%M %p, %z %Z').timestamp() * 1000)
                simplified_news.append({
                    "title": news_item['title'],
                    "url": news_item.get('link', ''),
                    "source": news_item.get('source', {}).get('name', 'Unknown source'),
                    "timestamp": timestamp
                })
        
        # 최신순으로 정렬하고 최대 5개의 기사 선택
        simplified_news.sort(key=lambda x: x["timestamp"], reverse=True)
        top_news = simplified_news[:5]
        
        return top_news
    except Exception as e:
        print(f"Error fetching news data: {e}")
        return []

# 뉴스 분석 템플릿 설정
news_search_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.

    비트코인 시장은 뉴스와 시장 상황에 따라 큰 영향을 받으며, 이에 따라 투자 결정을 신속하게 내릴 필요가 있습니다.
    
    최신 뉴스에서 비트코인 관련 시장 동향을 분석하고, 가능한 한 BUY 또는 SELL 결정을 통해 적극적으로 거래 전략을 수립하세요. 뉴스의 내용이 복잡하더라도 가능한 관망하지 말고, 현재 상황에 맞는 매수 또는 매도 결정을 추천하세요.
    
    다음의 뉴스 기사들을 참조하여 BUY, SELL 중 하나의 결정을 내리세요:
    {articles}

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 중 하나로만 작성 (HOLD는 뉴스가 명확하지 않거나 신뢰도가 낮을 때만 선택)",
        "summary": "뉴스 동향에 기반한 시장 분석과 투자 결정을 한국어로 서술",
        "sources": [
            {{"title": "기사 제목", "url": "기사 링크"}}
        ]
    }}
"""


class NewsSearchAnalysis(BaseModel):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]
    sources: List[dict]

# 프롬프트 템플릿과 출력 파서 설정
news_search_prompt_template = PromptTemplate.from_template(news_search_template)
news_output_parser = JsonOutputParser(pydantic_object=NewsSearchAnalysis)
news_search_chain = news_search_prompt_template | llm | news_output_parser

# 뉴스 검색 에이전트 함수
def news_search_agent(state: State) -> State:
    """최신 뉴스 데이터를 분석하여 비트코인 투자 결정을 내리는 에이전트 함수."""
    try:
        # 뉴스 데이터 가져오기
        news_data = get_news_data()
        
        # 기사 목록을 문자열로 변환하고 소스 리스트 생성
        articles = "\n".join([f"- {item['title']} ({item['url']})" for item in news_data])
        sources_list = [{"title": item['title'], "url": item['url']} for item in news_data]

        # LLM을 호출하여 뉴스 분석 수행
        result = news_search_chain.invoke({"articles": articles})
        print("뉴스 검색 LLM 호출 성공:", result)

        # 최종 결과 반환
        return {
            "news_search": {
                "decision": result["decision"],
                "summary": result["summary"],
                "sources": sources_list  # 최대 5개의 기사만 포함
            }
        }
    except Exception as e:
        print(f"Error in news_search_agent: {e}")
        return state