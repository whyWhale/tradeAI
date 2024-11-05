from pydantic import BaseModel
from typing import List, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from langchain_community.utilities import SerpAPIWrapper
from core.config import llm
from core.state import State


# 뉴스 검색 초기화
search = SerpAPIWrapper()

# 뉴스 검색 템플릿
news_search_template = """당신은 비트코인 시장의 투자 분석 전문가입니다. 
    최신 뉴스에서 비트코인 관련 시장 동향을 조사하고 이를 분석하여 결정하세요.
    
    다음의 뉴스 기사들을 참조하여 BUY, SELL, HOLD 중 하나의 결정을 내리세요:
    {articles}

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "뉴스 동향에 기반한 시장 분석과 투자 결정을 서술",
        "sources": ["뉴스 기사 링크를 포함해 주세요"]
    }}
    """
news_search_prompt_template = PromptTemplate.from_template(news_search_template)

# 뉴스 검색 분석 Pydantic 모델
class NewsSearchAnalysis(BaseModel):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]
    sources: list[str]

# 뉴스 검색 출력 파서
news_output_parser = JsonOutputParser(pydantic_object=NewsSearchAnalysis)
news_search_chain = news_search_prompt_template | llm | news_output_parser

# 뉴스 검색 에이전트 함수
def news_search_agent(state: State) -> State:
    try:
        # 뉴스 기사 검색
        search_results = search.run("bitcoin latest news")
        articles = "\n".join([f"- {item['title']} ({item['link']})" for item in search_results[:5]])

        # LLM 호출
        result = news_search_chain.invoke({"articles": articles})
        print("뉴스 검색 LLM 호출 성공:", result)

        # 새로운 메시지 추가
        new_message = f"News Search Decision: {result['decision']}, News Search Summary: {result['summary']}"
        updated_messages = state.messages + [new_message]

        # 상태 업데이트 및 반환
        return state.copy(update={"messages": updated_messages, "news_search": {"decision": result["decision"], "summary": result["summary"], "sources": result["sources"]}})
    except Exception as e:
        print("news_search_agent 처리 중 오류 발생:", str(e))
        raise
