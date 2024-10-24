import requests
import json
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from typing import Literal, TypedDict

# API KEY
from dotenv import load_dotenv
load_dotenv()

url = "https://api.alternative.me/fng/?date_format=kr&limit="


def get_fear():
    # 30일로 설정
    _url = url + "30"
    res = requests.request("GET", _url)

    parsed = json.loads(res.text)
    data = parsed["data"]

    # 데이터의 value 값만 리스트로 추출
    values = [int(item['value']) for item in data]

    return values


# 1. model
model = ChatOpenAI(
    model="gpt-3.5-turbo",
    max_tokens=2048,
    temperature=0.1,
)

# 2. template
template = """당신은 투자 분석 전문가 입니다. 
    현재 공포 탐욕 지수의 최근 30일 지수의 정보는 다음과 같습니다: {values}

    분석 결과를 다음 JSON 형식으로 제공해주세요:
    {{
        "summary": "시장 분석 및 예측 내용을 상세히 서술. 투자 결정을 제안하고 해당 이유를 서술",
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성"
    }}

    주의사항:
    - summary는 현재 시장 상황과 향후 전망을 포함해야 합니다. 투자 결정을 제안하고 해당 이유를 서술해야 합니다
    - decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
    """

prompt_template = PromptTemplate.from_template(template)

# 3. outputParser
class Analysis(TypedDict):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]

output_parser = JsonOutputParser(pydantic_object=Analysis)

# chain
chain = prompt_template | model | output_parser

values = get_fear()
result = chain.invoke({"values": values})
print(result)
print('summary: ', result['summary'])
print('decision: ', result['decision'])