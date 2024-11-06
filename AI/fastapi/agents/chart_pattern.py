import base64
from pydantic import BaseModel
from typing import Literal
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.capture import capture_chart_screenshot
from core.state import State
import json

class ImageAnalysisResult(BaseModel):
    decision: Literal["BUY", "SELL", "HOLD"]
    summary: str

def encode_image_from_file(file_path: str) -> str:
    print(">>> Starting image encoding process")
    try:
        with open(file_path, "rb") as image_file:
            image_content = image_file.read()
            file_ext = file_path.split('.')[-1].lower()
            mime_type = "image/jpeg" if file_ext in ["jpg", "jpeg"] else "image/png"
            encoded_data = base64.b64encode(image_content).decode('utf-8')
            print(f">>> Successfully encoded image: {file_path}")
            print(f">>> Image type: {mime_type}")
            print(f">>> Encoded data length: {len(encoded_data)} characters")
            return f"data:{mime_type};base64,{encoded_data}"
    except Exception as e:
        print(f">>> ERROR: Failed to encode image: {str(e)}")
        raise

# 프롬프트 템플릿 설정
image_analysis_template = """당신은 비트코인 차트를 해석하는 시각적 패턴 분석 전문가입니다.
당신의 임무는 주어진 차트 이미지를 기반으로 주요 시각적 패턴과 거래 심리를 분석하여 사용자가 매수, 매도, 보류 중 하나의 결정을 내릴 수 있도록 도움을 주는 것입니다.

분석해야 할 항목은 다음과 같습니다:
1. 주요 차트 패턴 식별 (예: 헤드 앤 숄더, 삼각형 패턴, 깃발 패턴 등)
2. 거래량 스파이크 및 시장 심리 분석
3. 캔들스틱 반전 패턴 탐지 (예: Pinbar, Engulfing 등)
4. 추세의 시각적 흐름 및 돌파 분석

주어진 이미지의 분석 결과를 기반으로 투자 결정 및 투자 결정에 대한 이유를 제공해주세요.

결과는 반드시 JSON 형식으로 출력하세요:
{{
    "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
    "summary": "시장 분석 및 예측 내용을 상세히 서술"
}}
"""

print(">>> Initializing prompt template and chain")
image_prompt_template = PromptTemplate.from_template(image_analysis_template)
image_output_parser = JsonOutputParser(pydantic_object=ImageAnalysisResult)
image_chain = image_prompt_template | llm | image_output_parser
print(">>> Chain initialization completed")

def chart_pattern_agent(state: State) -> State:
    print(">>> Starting chart pattern analysis")
    try:
        # 차트 이미지 캡처
        print(">>> Capturing chart screenshot...")
        image_path = capture_chart_screenshot()
        print(f">>> Chart screenshot captured successfully: {image_path}")

        # 이미지 인코딩
        print(">>> Starting image encoding process")
        encoded_image = encode_image_from_file(image_path)
        print(">>> Image encoding completed")

        # dict 형태로 입력값 전달
        print(">>> Preparing input data for LLM")
        input_data = {"image_data": encoded_image}
        print(">>> Input data prepared")
        
        # 이미지 분석 수행
        print(">>> Invoking LLM for chart analysis...")
        result = image_chain.invoke(input_data)
        print(">>> LLM analysis completed")
        print(f">>> Raw analysis result: {result}")

        # 결과 파싱 검증
        if not isinstance(result, dict):
            print(">>> Warning: Result is not a dict. Attempting to parse JSON...")
            try:
                result = json.loads(result)
                print(">>> Successfully parsed result as JSON")
            except json.JSONDecodeError as json_err:
                print(f">>> ERROR: JSON parsing failed: {json_err}")
                print(f">>> Raw result that failed to parse: {result}")
                raise ValueError("Failed to parse the result as JSON")

        # 새 메시지 생성
        print(">>> Creating new message with analysis results")
        new_message = (f"Chart Analysis Decision: {result['decision']}, "
                        f"Chart Analysis Summary: {result['summary']}")
        print(f">>> New message created: {new_message}")

        # State 업데이트
        print(">>> Updating state with new information")
        updated_messages = state.messages + [new_message]
        updated_state = state.copy(update={
            "messages": updated_messages,
            "chart_pattern": {
                "decision": result["decision"],
                "summary": result["summary"]
            }
        })
        print(">>> State updated successfully")

        return updated_state

    except Exception as e:
        print(f">>> ERROR: Exception in chart_pattern_agent: {str(e)}")
        print(f">>> ERROR: Exception type: {type(e).__name__}")
        print(f">>> ERROR: Full exception details: {e}")
        return state