from pydantic import BaseModel
from typing import List, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.utilities import SerpAPIWrapper
from core.config import llm
from core.state import State

# SerpAPIWrapper 초기화 및 파라미터 설정
search = SerpAPIWrapper(params={
    "q": "bitcoin investment news",  # 검색어
    "num": 5,  # 최대 5개의 결과 가져오기
    "sort_by": "date",  # 최신 뉴스 순으로 정렬
    "hl": "en",  # 언어 설정 (영어)
    "gl": "US",  # 국가 설정 (미국)
    "filter": "1"  # 중복된 기사 필터링 활성화
})

# 뉴스 검색 템플릿
news_search_template = """당신은 비트코인 시장의 투자 분석 전문가입니다. 
    최신 뉴스에서 비트코인 관련 시장 동향을 조사하고 이를 분석하여 결정하세요.
    
    다음의 뉴스 기사들을 참조하여 BUY, SELL, HOLD 중 하나의 결정을 내리세요:
    {articles}

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "뉴스 동향에 기반한 시장 분석과 투자 결정을 서술",
        "sources": [
            {{
                "title": "기사 제목",
                "url": "기사 링크"
            }}
        ]
    }}
"""

# 뉴스 검색 분석 Pydantic 모델
class NewsSearchAnalysis(BaseModel):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]
    sources: List[dict]

# 뉴스 검색 출력 파서
news_search_prompt_template = PromptTemplate.from_template(news_search_template)
news_output_parser = JsonOutputParser(pydantic_object=NewsSearchAnalysis)
news_search_chain = news_search_prompt_template | llm | news_output_parser

# 뉴스 검색 에이전트 함수
def news_search_agent(state: State) -> State:
    try:
        # 뉴스 기사 검색
        search_results = search.run("bitcoin investment news")

        # 기사 추출 및 sources 리스트 생성
        articles = "\n".join([f"- {item['title']} ({item['link']})" for item in search_results])
        sources_list = [{"title": item['title'], "url": item['link']} for item in search_results]

        # LLM 호출
        result = news_search_chain.invoke({"articles": articles})
        print("뉴스 검색 LLM 호출 성공:", result)

        # 새로운 메시지 추가
        new_message = (f"News Search Decision: {result['decision']}, "
                        f"News Search Summary: {result['summary']}, "
                        f"Sources: {sources_list}")

        return {
            "messages": [new_message],
            "chart_pattern": {
                "decision": result["decision"],
                "summary": result["summary"],
                "sources": sources_list
            }
        }
    except Exception as e:
        print("news_search_agent 처리 중 오류 발생:", str(e))
        raise
