import base64
from pydantic import BaseModel
from typing import Literal, Optional
from core.config import llm
from core.capture_firefox import capture_chart_screenshot
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

# 차트 패턴 분석 프롬프트
image_analysis_template = """당신은 비트코인 차트를 해석하는 시각적 패턴 분석 전문가입니다.

당신은 수익률 극대화와 데이터 기반 접근을 통한 거래 결정을 위해 주어진 차트 이미지를 기반으로 주요 시각적 패턴을 분석하여 비트코인 거래 전략을 수립합니다.

주어진 이미지는 4시간 단위의 캔들 차트가 포함된 비트코인 실시간 현황 화면 이미지입니다. 해당 이미지를 바탕으로 최근의 차트 패턴이 아래 10개 패턴 중 어떠한 패턴이랑 가장 유사한지 추론하고, 패턴이 시사하는 즉각적인 BUY 또는 SELL 결정을 내리세요. 단, 패턴이 명확하지 않더라도 패턴의 방향성에 따라 적극적으로 거래 행동을 취하도록 합니다.

1. 상승 삼각형 (ascending_triangle) - 상승 패턴
2. 컵 앤 핸들 (cup_and_handle) - 상승 패턴
3. 하락 삼각형 (descending_triangle) - 하락 패턴
4. 이중 천정과 이중 바닥 (double_top_and_double_bottom) - 이중 천정은 하락 패턴, 이중 바닥은 상승 패턴
5. 하락 쐐기형 (falling_wedge) - 상승 패턴
6. 깃발형 (flags) - 상승 또는 하락 패턴, 기존 추세에 따라 방향이 결정됨 (상승 추세에서 나타나면 상승 패턴, 하락 추세에서 나타나면 하락 패턴)
7. 헤드 앤 숄더 (head_and_shoulder) - 하락 패턴
8. 페넌트형 (pennants) - 상승 또는 하락 패턴, 기존 추세에 따라 방향이 결정됨 (상승 추세에서 나타나면 상승 패턴, 하락 추세에서 나타나면 하락 패턴)
9. 상승 쐐기형 (rising_wedge) - 하락 패턴
10. 대칭 삼각형 (symmetrical triangle) - 상승 또는 하락 패턴, 돌파 방향에 따라 결정됨 (상방 돌파 시 상승 패턴, 하방 돌파 시 하락 패턴)

패턴이 확인되면, 해당 패턴이 시사하는 비트코인 가격의 상승 또는 하락 가능성에 따라 즉각적인 BUY 또는 SELL 결정을 내리세요. HOLD 결정을 최소화하고, 비록 돌파 방향이 확정적이지 않더라도 패턴의 방향성을 참고하여 예상되는 돌파 방향에 맞춰 BUY 또는 SELL을 권장합니다. 추가 관망이 필요한 경우라도, 가능한 한 현재 상황에 따른 매수 또는 매도를 결정해보세요.

만약 주어진 이미지에 차트가 포함되어 있지 않거나, 10개의 패턴 중 유사한 패턴이 없다고 판단되면, pattern_num에 0을 반환하세요.

결과는 반드시 JSON 형식으로 출력하세요:
{{
    "decision": "BUY 또는 SELL 중 하나로만 작성 (HOLD는 예외적 상황에서만 선택)",
    "pattern_num": "가장 유사하다고 판단한 패턴의 번호를 숫자로 입력, 어떠한 패턴도 식별되지 않았다면 0을 출력",
    "summary": "차트 패턴 분석과 즉각적인 투자 결정을 상세히 서술"
}}
"""

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

        # 메시지 생성: 텍스트 프롬프트와 인코딩된 이미지 포함
        messages = [
            {"role": "system", "content": image_analysis_template},
            {"role": "user", "content": [
                {"type": "text", "text": "당신에게 주어진 이미지는 비트코인의 실시간 자산 변동 그래프입니다. 주요 시각적 패턴, 추세의 시각적 흐름을 분석하고, 향후 4시간 내의 가격 예측 및 이에 따른 투자 전략을 JSON 형식으로 제안하세요."},
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

        # 새로운 메시지 추가
        # new_message = (f"Chart Analysis Decision: {parsed_content['decision']}, "
        #                 f"Chart Analysis Summary: {parsed_content['summary']}")

        return {
            "chart_pattern": {
                "decision": parsed_content["decision"],
                "pattern_num": parsed_content["pattern_num"],
                "summary": parsed_content["summary"],
                "image_base64": encoded_image
            }
        }

    except Exception as e:
        print(f">>> ERROR: Exception in chart_pattern_agent: {str(e)}")
        print(f">>> ERROR: Exception type: {type(e).__name__}")
        print(f">>> ERROR: Full exception details: {e}")
        return state