from pydantic import BaseModel
from typing import Optional, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.state import State

# 마스터 템플릿
master_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    현재 당신 회사에 속한 투자 전문가들은 비트코인 투자 결정을 다음과 같이 했습니다:
    {master_decision}
    당신은 해당 결정을 따르기로 했습니다.
    
    해당 결정을 뒷받침하는 투자 전문가들의 의견을 종합해주세요:
    {contents}
    
    만약, 투자 전문가들의 의견이 "DRAW"라면 당신이 전반적인 내용을 종합하여 "BUY", "SELL", "HOLD" 중 하나를 골라주세요.
    해당 결정을 가지고 투자 자본을 얼만큼의 비중으로 진행할지 퍼센트도 결정해주세요.

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "percentage": "현재 가지고 있는 자본 중 몇 퍼센트를 의사결정 할지 0부터 50까지 10 단위로 작성. 만약 HOLD면 0으로 설정",
        "summary": "투자 결정에 대한 이유를 자세히 서술"
    }}

    주의사항:
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
    """
master_prompt_template = PromptTemplate.from_template(master_template)

# 마스터 분석 Pydantic 모델
class MasterAnalysis(BaseModel):
    summary: str
    percentage: int
    decision: Literal["BUY", "SELL", "HOLD"]

# 마스터 출력 파서
master_output_parser = JsonOutputParser(pydantic_object=MasterAnalysis)
master_chain = master_prompt_template | llm | master_output_parser

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
    return (0, 0, 0)  # 유효하지 않은 결정의 경우

# 마스터 에이전트 함수
def master_agent(state: State) -> State:
    total_buy = 0
    total_sell = 0
    total_hold = 0

    # Fear & Greed 결정 카운트
    if state.fng and "decision" in state.fng:
        buy, sell, hold = count_decision(state.fng["decision"])
        total_buy += buy
        total_sell += sell
        total_hold += hold

    # 뉴스 검색 결정 카운트
    if state.news_search and "decision" in state.news_search:
        buy, sell, hold = count_decision(state.news_search["decision"])
        total_buy += buy
        total_sell += sell
        total_hold += hold

    # 퀀트 분석 결정 카운트
    if state.quant and "decision" in state.quant:
        buy, sell, hold = count_decision(state.quant["decision"])
        total_buy += buy
        total_sell += sell
        total_hold += hold

    # 차트 분석 결정 카운트
    if state.chart_pattern and "decision" in state.chart_pattern:
        buy, sell, hold = count_decision(state.chart_pattern["decision"])
        total_buy += buy
        total_sell += sell
        total_hold += hold

    # 투표 결과 결정
    if total_buy > total_sell and total_buy > total_hold:
        master_decision = "BUY"
    elif total_sell > total_buy and total_sell > total_hold:
        master_decision = "SELL"
    elif total_hold > total_buy and total_hold > total_sell:
        master_decision = "HOLD"
    else:
        master_decision = "DRAW"

    print(f"decision count: BUY({total_buy}), SELL({total_sell}), HOLD({total_hold})")
    print(f"Master: {master_decision}")

    # 마스터 결정 진행
    result = master_chain.invoke({
        "master_decision": master_decision, 
        "contents": state.messages
    })

    return state.copy(update={
        "messages": state.messages,
        "master": {
            "decision": result["decision"],
            "percentage": result["percentage"],
            "summary": result["summary"]
        }
    })
