from pydantic import BaseModel
from typing import Optional, Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.state import State


# 에이전트 관리
agents_name = ["fng", "quant", "news_search", "chart_pattern"]


master_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    현재 당신 회사에 속한 투자 전문가들은 비트코인 투자 결정을 다음과 같이 했습니다:
    {master_decision}
    당신은 해당 결정을 따르기로 했습니다.
    
    해당 결정을 뒷받침하는 투자 전문가들의 의견을 종합해주세요:
    {agents_analysis}

    당신의 투자 성향은 다음과 같습니다:
    공격적인 투자로 단기간에 수익을 내야 합니다.
    
    만약, 투자 전문가들의 의견이 "DRAW"라면 당신이 전반적인 내용을 종합하여 "BUY", "SELL", "HOLD" 중 하나를 골라주세요.
    해당 결정을 가지고 투자 자본을 얼만큼의 비중으로 진행할지 퍼센트도 결정해주세요.

    현재 당신이 가지고 있는 주문 가능 금액은 다음과 같습니다: {available_amount}
    만약, "BUY"인데 "6000"원 이하로 당신의 투자 금액이 있다면, "HOLD"를 해주세요.
    그리고 "BUY"에 대한 의사결정이 있었지만, 보유 금액 부족으로 "HOLD"를 하게 된 투자 결정에 대한 이유를 추가해주세요.

    현재 당신이 가지고 있는 비트코인 원화 금액은 다음과 같습니다: {btc_balance_krw}
    만약, "SELL"인데 "6000"원 이하로 당신의 비트코인 원화 금액이 있다면, "HOLD"를 해주세요.
    그리고 "SELL"에 대한 의사결정이 있었지만, 보유 금액 부족으로 "HOLD"를 하게 된 투자 결정에 대한 이유를 추가해주세요.
    
    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "percentage": "현재 가지고 있는 주문 가능 금액 또는 보유 비트코인 원화에서 몇 퍼센트의 비중으로 주문할지 0부터 50까지 10 단위로 작성. 만약 HOLD면 0으로 설정",
        "summary": "투자 결정에 대한 이유를 자세히 서술"
    }}

    주의사항:
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
    """

class MasterAnalysis(BaseModel):
    summary: str
    percentage: int
    decision: Literal["BUY", "SELL", "HOLD"]

master_prompt_template = PromptTemplate.from_template(master_template)
master_output_parser = JsonOutputParser(pydantic_object=MasterAnalysis)
master_chain = master_prompt_template | llm | master_output_parser

# 주문 금액 결정 함수
def order_amount_calculator(decision, percent, available_order_amount, btc_holdings_in_krw):
    if decision == 'HOLD':
        return 0

    order_amount = (percent / 100) * (available_order_amount if decision == 'BUY' else btc_holdings_in_krw)

    if decision == 'BUY':
        return max(6000, order_amount)
    elif decision == 'SELL':
        return max(6000, order_amount)

    # 예외적으로 다른 값이 들어왔을 경우 0 반환
    return 0

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

# 에이전트
def master_agent(state: State) -> State:
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

    print(f"decision count: BUY({total_buy}), SELL({total_sell}), HOLD({total_hold})")
    print(f"Master: {master_decision}")

    # 마스터 결정 진행
    agents_analysis = extract_agent_decisions(state)
    result = master_chain.invoke({
        "master_decision": master_decision,
        "agents_analysis": agents_analysis,
        "available_amount": state.user_info["available_amount"],
        "btc_balance_krw": state.user_info["btc_balance_krw"]
    })

    # 주문 결정
    order_amount = order_amount_calculator(
        result["decision"],
        result["percentage"],
        state.user_info["available_amount"],
        state.user_info["btc_balance_krw"]
    )

    return {
        "master": {
            "decision": result["decision"],
            "percentage": result["percentage"],
            "order_amount": order_amount,
            "summary": result["summary"]
        }
    }