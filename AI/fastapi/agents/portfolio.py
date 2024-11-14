from pydantic import BaseModel
from typing import Optional, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.state import State


portfolio_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    4시간마다 시장 분석을 통해서 비트코인 투자 결정을 하고 있는 상황입니다.

    현재 당신은 시장조사를 한 결과 비트코인 투자 결정을 다음과 같이 했습니다:
    {final_decision}

    현재 주문 가능 금액은 다음과 같습니다: {available_amount}원
    현재 보유 비트코인 원화 금액은 다음과 같습니다: {btc_balance_krw}원

    현재 5일 간 투자 손익 정보입니다:
    {investment_performance_summary}

    현재 최근 10회 비트코인 투자 시점에서의 시세와 보유 자산 상황을 기록한 정보입니다:
    {bitcoin_position_history}
    
    현재 당신의 투자 성향입니다:
    {investment_preference}

    비트코인 투자 결정, 현재 주문 가능 금액과 보유 비트코인, 투자 손익 정보, 비트코인 시세와 보유 자산 상황, 투자 성향을 종합하여
    BUY인 경우 현재 자산 몇 퍼센트를 투자할지,
    SELL인 경우 현재 보유 비트코인 중 몇 퍼센트를 팔지 정해줘.

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "percentage": "10부터 100까지 10 단위로 작성. 만약 HOLD면 0으로 설정",
        "summary": "퍼센트 결정에 대한 이유를 자세히 서술"
    }}

    주의사항:
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
    """

class PortfolioAnalysis(BaseModel):
    percentage: int
    summary: str

portfolio_prompt_template = PromptTemplate.from_template(portfolio_template)
portfolio_output_parser = JsonOutputParser(pydantic_object=PortfolioAnalysis)
portfolio_chain = portfolio_prompt_template | llm | portfolio_output_parser

# 주문 금액 결정 함수
def order_amount_calculator(decision, percent, available_order_amount, btc_holdings_in_krw):
    # percent를 숫자 형식으로 변환
    try:
        percent = float(percent)
    except ValueError:
        print("Error: percent 값이 숫자 형식이 아닙니다.")
        return 0  # percent가 숫자 형식이 아닌 경우 0 반환

    if decision == 'HOLD':
        return 0

    # BUY 또는 SELL 결정에 따른 주문 금액 계산
    order_amount = (percent / 100) * (available_order_amount if decision == 'BUY' else btc_holdings_in_krw)

    if decision == 'BUY' or decision == 'SELL':
        return max(6000, order_amount)

    # 예외적으로 다른 값이 들어왔을 경우 0 반환
    return 0


# 에이전트
def portfolio_agent(state: State) -> State:
    # 사용자 정보 가져오기

    # 의사 결정 실행
    result = portfolio_chain.invoke({
        "final_decision": state.decision_maker["decision"],
        "available_amount": state.user_info["available_amount"],
        "btc_balance_krw": state.user_info["btc_balance_krw"],
        "investment_preference": state.decision_maker["investment_preference"],
        "investment_performance_summary": state.user_info["investment_performance_summary"],
        "bitcoin_position_history": state.user_info["bitcoin_position_history"]
    })

    order_amount = order_amount_calculator(
        state.decision_maker["decision"],
        result["percentage"],
        state.user_info["available_amount"],
        state.user_info["btc_balance_krw"]
    )

    return {
        "portfolio": {
            "percentage": result["percentage"],
            "order_amount": order_amount,
            "summary": result["summary"]
        },
        "decision_maker": {
            "percentage": result["percentage"],
            "order_amount": order_amount
        }
    }