from pydantic import BaseModel
from typing import Literal
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import TextLoader
from langchain_community.vectorstores import FAISS
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain.agents import tool
from core.state import State
import os
import json
import re

# 에이전트 관리
agents_name = ["fng", "quant", "news_search", "chart_pattern"]

# Step 1: Investment preference retrieval tool
file_path = os.path.join(os.path.dirname(__file__), "investment.txt")
loader = TextLoader(file_path, encoding="utf-8")
docs = loader.load()

# Split documents and create embeddings
text_splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=50)
split_documents = text_splitter.split_documents(docs)
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(documents=split_documents, embedding=embeddings)
preference_retriever = vectorstore.as_retriever()

# Define the retrieval tool
@tool
def investment_preference_search(query: str) -> str:
    """Retrieve investment preferences."""
    relevant_docs = preference_retriever.invoke(query)  # 단순 문자열로 전달
    return relevant_docs[0].page_content if relevant_docs else "No relevant information found."

# Tool binding
llm = ChatOpenAI(model="gpt-4o", temperature=0)
llm_with_tools = llm.bind_tools([investment_preference_search])

# Master template setup
master_template = """
당신은 비트코인 시장의 투자 분석 전문가입니다.
현재 당신 회사에 속한 투자 전문가들은 비트코인 투자 결정을 다음과 같이 했습니다:
{master_decision}


해당 결정을 뒷받침하는 투자 전문가들의 의견을 종합해주세요:
{agents_analysis}

만약, 투자 전문가들의 의견이 "DRAW"라면, 전반적인 내용을 종합하여 "BUY", "SELL", "HOLD" 중 하나를 골라주세요.
그리고 선택한 결정에 따라 투자 자본을 몇 퍼센트의 비중으로 진행할지 0부터 50까지 10 단위로 결정해주세요.

현재 당신의 주문 가능 금액은 다음과 같습니다: {available_amount}원
현재 당신의 보유 비트코인 원화 금액은 다음과 같습니다: {btc_balance_krw}원

이후 사용자의 투자 성향 정보를 참고하여 최종 결정을 내리세요:
{investment_preference}

최종 결정
- 결과는 반드시 JSON 형식으로 출력하세요.
- 출력 예시:
{{
    "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
    "percentage": "결정한 퍼센트를 10단위로 작성. HOLD면 0으로 설정",
    "summary": "투자 결정에 대한 이유를 자세히 서술"
}}

주의사항:
- decision은 반드시 BUY 또는 SELL 또는 HOLD 중 하나여야 합니다
- JSON 형식에서 키는 반드시 따옴표로 묶어 주세요
- 다른 형식이 아닌 예시와 같은 JSON 형식을 정확히 따르세요
"""

class MasterAnalysis(BaseModel):
    summary: str
    percentage: int
    decision: Literal["BUY", "SELL", "HOLD"]

# Prompt and Output Parser setup
master_prompt_template = PromptTemplate.from_template(master_template)
master_output_parser = JsonOutputParser(pydantic_object=MasterAnalysis)




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




# Step 3: Master agent function
def master_agent(state: State) -> dict:
    # 투자 성향 정보 추출
    investment_type = state.user_info.get("investment_type")
    # 단일 문자열로 query 값 전달
    investment_preference = investment_preference_search.invoke(investment_type) if investment_type else "투자 성향 정보가 제공되지 않았습니다."

    
    # 에이전트 분석 내용 가져오기
    agents_analysis = extract_agent_decisions(state)
    # agents_analysis = "Sample analysis text."  # 각 에이전트 분석 내용을 종합한 텍스트
    master_decision = "BUY"  # 기본값 설정


    # Prompt를 이용한 입력값 문자열 생성
    formatted_input = {
        "master_decision": master_decision,
        "agents_analysis": agents_analysis,
        "investment_preference": investment_preference,
        "available_amount": state.user_info["available_amount"],
        "btc_balance_krw": state.user_info["btc_balance_krw"]
    }

    # Master chain 실행
    try:
        prompt_result = master_prompt_template.format(**formatted_input)
        result = llm.invoke(prompt_result)  # LLM handles final response

        # Raw JSON 형태의 문자열을 추출
        raw_json_text = result.content

        # ```json과 ```를 제거하고 JSON 문자열로 정리
        cleaned_json_text = re.sub(r"```json|```", "", raw_json_text).strip()

        # JSON 문자열을 Python 딕셔너리로 변환
        parsed_result = json.loads(cleaned_json_text)
    except Exception as e:
        print("Error during chain invocation:", e)
        raise

    # 결과 반환
    return {
        "master": {
            "decision": parsed_result["decision"],
            "percentage": parsed_result["percentage"],
            "summary": parsed_result["summary"]
        }
    }