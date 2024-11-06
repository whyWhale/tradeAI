import base64
from pydantic import BaseModel
from typing import Literal, Optional
from core.config import llm
from core.capture_firefox import capture_chart_screenshot
from core.state import State
import json

# 차트 이미지 분석 결과를 위한 Pydantic 모델
class ImageAnalysisResult(BaseModel):
    decision: Literal["BUY", "SELL", "HOLD"]
    summary: str

# 이미지 파일을 base64로 인코딩하는 함수
def encode_image_from_file(file_path: str) -> str:
    with open(file_path, "rb") as image_file:
        image_content = image_file.read()
        file_ext = file_path.split('.')[-1].lower()
        mime_type = "image/jpeg" if file_ext in ["jpg", "jpeg"] else "image/png"
        return f"data:{mime_type};base64,{base64.b64encode(image_content).decode('utf-8')}"

# 차트 패턴 분석 프롬프트
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

# Chart Pattern Agent 함수
def chart_pattern_agent(state: State) -> State:
    try:
        # 차트 이미지 캡처
        image_path = capture_chart_screenshot()
        print("차트 패턴 분석 이미지 준비 완료:", image_path)

        # 이미지 인코딩
        encoded_image = encode_image_from_file(image_path)

        # 메시지 생성: 텍스트 프롬프트와 인코딩된 이미지 포함
        messages = [
            {"role": "system", "content": image_analysis_template},
            {"role": "user", "content": [
                {"type": "text", "text": "당신에게 주어진 이미지는 비트코인의 실시간 자산 변동 그래프입니다. 주요 시각적 패턴, 거래량 스파이크, 캔들스틱 반전 패턴, 추세의 시각적 흐름을 분석하고, 향후 4시간 내의 가격 예측 및 이에 따른 투자 전략을 JSON 형식으로 제안하세요."},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": encoded_image
                    }
                }
            ]}
        ]

        # LLM 호출을 통한 이미지 분석 수행
        result = llm.invoke(messages)
        
        # 결과가 JSON 형식의 문자열로 반환되므로 파싱하여 처리
        parsed_content = json.loads(result.content.strip("```json\n").strip("\n```"))
        print("차트 분석을 위한 LLM 호출 성공:", parsed_content)

        new_message = (f"Chart Analysis Decision: {parsed_content['decision']}, "
                       f"Chart Analysis Summary: {parsed_content['summary']}")

        updated_messages = state.messages + [new_message]

        # 반환할 state 객체에 chart_pattern 필드 추가
        updated_state = state.copy(update={
            "messages": updated_messages,
            "chart_pattern": {
                "decision": parsed_content["decision"],
                "summary": parsed_content["summary"]
            }
        })

        return updated_state

    except Exception as e:
        print(f"chart_pattern_agent 처리 중 오류 발생: {e}")
        return state
