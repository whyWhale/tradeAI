import requests
import json
from pydantic import BaseModel
from typing import List, Optional, Literal, TypedDict
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.state import State


# 공포 탐욕 지수 URL
url = "https://api.alternative.me/fng/?date_format=kr&limit="

fng_template = """당신은 투자 분석 전문가 입니다.
    아래는 공포 탐욕 지수 판단 자료입니다.
    Level 1: 0-25 points — Extreme Fear: Indicates a high level of pessimism; investors are highly risk-averse.
    Level 2: 26-50 points — Fear: Suggests cautious sentiment; investors are generally reluctant to take on risk.
    Level 3: Around 50 points — Neutral: Shows a balanced market sentiment with neither fear nor greed prevailing.
    Level 4: 51-75 points — Greed: Investors are becoming more optimistic, showing a greater willingness to take on risk.
    Level 5: 76-100 points — Extreme Greed: Indicates very high levels of optimism; investors are extremely risk-seeking.

    현재 공포 탐욕 지수 최근순으로 30일 지수의 정보는 다음과 같습니다:
    {info}

    분석 결과를 다음 JSON 형식으로 제공해주세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "시장 분석 및 예측 내용을 상세히 서술. 투자 결정을 제안하고 해당 이유를 서술",
    }}

    주의사항:
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
    - summary는 현재 시장 상황과 향후 전망을 포함해야 합니다. 투자 결정을 제안하고 해당 이유를 서술해야 합니다
    """

class FngAnalysis(TypedDict):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]

fng_prompt_template = PromptTemplate.from_template(fng_template)
json_output_parser = JsonOutputParser(pydantic_object=FngAnalysis)
fng_chain = fng_prompt_template | llm | json_output_parser

def get_fng():
    """
    FNG 데이터 가져오기 함수
    """
    _url = url + "30"
    try:
        res = requests.request("GET", _url)
        print("FNG API 요청 성공")
        parsed = json.loads(res.text)
        data = parsed["data"]
        info = [int(item['value']) for item in data]
        return info
    except Exception as e:
        print("FNG 데이터 가져오기 실패:", str(e))
        raise

def fng_agent(state: State) -> State:
    try:
        fng_info = get_fng()
        print("FNG 데이터 준비 완료:", fng_info)

        result = fng_chain.invoke({"info": fng_info})
        print("FNG을 위한 LLM 호출 성공:", result)

        new_message = f"FNG Analysis Decision: {result['decision']}, FNG Analysis Summary: {result['summary']}"
        updated_messages = state.messages + [new_message]

        return state.copy(
            update={
                "messages": updated_messages,
                "fng": {
                    "decision": result["decision"],
                    "summary": result["summary"]
                }
            }
        )

    except Exception as e:
        print("fng_agent 처리 중 오류 발생:", str(e))
        raise