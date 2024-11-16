from pydantic import BaseModel
from typing import Optional, Literal
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from core.state import State
from core.config import llm_gpt_4o as llm
import os

# 에이전트 관리(Lv.1)
agents_name = ["fng", "quant", "news_search", "chart_pattern"]

# 파일 불러오기(investment.txt 파일 경로 확인 필요)
file_path = os.path.join(os.path.dirname(__file__), "investment.txt")
loader = TextLoader(file_path, encoding="utf-8")
docs = loader.load()

# 벡터 저장소 활용한 문서 임베딩
text_splitter = RecursiveCharacterTextSplitter(chunk_size=350, chunk_overlap=50)
split_documents = text_splitter.split_documents(docs)
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
preference_retriever = vectorstore.as_retriever()

# RAG 위한 검색 함수
def investment_preference_search(query: str) -> str:
    relevant_docs = preference_retriever.invoke(query)
    return relevant_docs[0].page_content if relevant_docs else "예외: 유사한 투자 성향을 찾을 수 없습니다."

decision_template = """
    당신은 KRW-BTC 페어의 비트코인 거래를 위해 고급 가상 비서 역할을 수행합니다.
    주요 목표는 수익률 극대화와 데이터 기반 접근을 통한 거래 결정입니다.
    시장 분석, 실시간 데이터, 비트코인 관련 뉴스 인사이트, 차트 패턴, 투자 성향을 모두 활용하여 거래 전략을 수립하세요.
    각 거래 추천 시, 행동, 그 근거, 투자 비율을 명확하게 설명하고 리스크 관리 프로토콜과의 일관성을 유지해야 합니다.

    현재 투자 전문가들의 의견은 다음과 같습니다:
    {master_decision}

    fng는 공포 탐욕 지수를 분석하는 전문가, 
    quant는 퀀트로 투자하는 전문가, 
    news_search는 뉴스 검색으로 분석하는 전문가,
    chart_pattern은 차트 패턴으로 분석하는 전문가를 의미합니다.
    해당 결정을 뒷받침하는 투자 전문가들의 의견을 종합해주세요:
    {agents_analysis}

    투자자의 성향에 따라 적극적인 투자 성향을 반영하여 최종 결정을 내리세요:
    {investment_preference}

    투자 성향에 따라 수익을 극대화할 수 있도록 최종 결정을 내려주세요. 관망을 최소화하고, 최대한 BUY 또는 SELL 결정을 권장하며, 시장 상황에 따라 리스크를 관리합니다.

    최종 결정
    - 결과는 반드시 JSON 형식으로 출력하세요.
    - 출력 예시:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "투자 결정에 대한 이유를 자세히 서술. 전문가의 이름을 한글로 만들어서 설명."
    }}

    주의사항:
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
"""

class DecisionAnalysis(BaseModel):
    summary: str
    percentage: int
    decision: Literal["BUY", "SELL", "HOLD"]

decision_prompt_template = PromptTemplate.from_template(decision_template)
decision_output_parser = JsonOutputParser(pydantic_object=DecisionAnalysis)
decision_chain = decision_prompt_template | llm | decision_output_parser

def extract_agent_decisions(state):
    combined_analysis = []
    for key in agents_name:
        agent_data = getattr(state, key)
        if agent_data:
            try:
                analysis_text = f"{key.upper()} Analysis Decision: {agent_data['decision']}, {key.upper()} Analysis Summary: {agent_data['summary']}"
                combined_analysis.append(analysis_text)
            except KeyError as e:
                print(f"Missing key in {key} data: {e}")
                continue
    return "\n".join(combined_analysis)

# 단일 결정 카운트 함수
def count_decision(decision: Optional[str]) -> tuple[int, int, int]:
    if not decision:
        return (0, 0, 0)
    if decision == "BUY":
        return (1, 0, 0)
    elif decision == "SELL":
        return (0, 1, 0)
    elif decision == "HOLD":
        return (0, 0, 1)
    return (0, 0, 0)  # 유효하지 않은 결정의 경우 제외

# 결정 에이전트
def decision_agent(state: State) -> dict:
    # 투자 성향 정보 가져오기
    investment_type = state.user_info.get("investment_type")
    investment_preference = (
        investment_preference_search(investment_type)
        if investment_type is not None and investment_type != "None"
        else "투자 성향 정보가 제공되지 않았습니다."
    )

    total_buy = 0
    total_sell = 0
    total_hold = 0
    
    # 각 에이전트의 결정을 카운트
    for agent in agents_name:
        if getattr(state, agent) and "decision" in getattr(state, agent):
            buy, sell, hold = count_decision(getattr(state, agent)["decision"])
            total_buy += buy
            total_sell += sell
            total_hold += hold
    counts = {
        "BUY": total_buy,
        "SELL": total_sell,
        "HOLD": total_hold
    }
    master_decision = max(counts, key=counts.get)

    # 동점인 경우 "DRAW" 처리
    if list(counts.values()).count(max(counts.values())) > 1:
        master_decision = "DRAW"

    # 마스터 결정 진행
    agents_analysis = extract_agent_decisions(state)
    try:
        result = decision_chain.invoke({
            "master_decision": master_decision,
            "agents_analysis": agents_analysis,
            "investment_preference": investment_preference,
            "available_amount": state.user_info["available_amount"],
            "btc_balance_krw": state.user_info["btc_balance_krw"]
        })
        print("decision_maker 에이전트 호출 성공 :", result)
    except Exception as e:
        print("Error during chain invocation:", e)
        raise

    return {
        "decision_maker": {
            "decision": result["decision"],
            "summary": result["summary"],
            "investment_preference": investment_preference
        }
    }
