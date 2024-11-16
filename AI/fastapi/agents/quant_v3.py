import requests
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm_gpt_4o as llm
from core.state import State


# 프롬프트 템플릿 설정
quant_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    현재 당신은 4시간 마다 자동으로 비트코인 투자 결정을 내리고 있습니다.

    당신은 퀀트 분석가로 다양한 기술적 분석을 통해 현재 투자 의사결정을 내려야 합니다.
    퀀트 알고리즘으로 이동 평균선, RSI, MACD, 볼린저 밴드, 거래량 등을 계산 한 뒤 의사결정을 해주세요.
    계산 과정은 필요없습니다. 구체적인 숫자를 기준으로 평가하세요.

    현재 4시간 단위 캔들 데이터는 다음과 같습니다:
    {candle_data}
    
    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "알고리즘 분석으로 투자 결정에 대한 이유를 자세히. 서술 구체적인 숫자를 제공"
    }}
    """

class QuantAnalysis(BaseModel):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]

quant_prompt_template = PromptTemplate.from_template(quant_template)
quant_output_parser = JsonOutputParser(pydantic_object=QuantAnalysis)
quant_chain = quant_prompt_template | llm | quant_output_parser

# DataFrame을 JSON으로 변환하는 유틸리티 함수
def df_to_json(df: pd.DataFrame) -> dict:
    def convert_value(value):
        if pd.isna(value):
            return None
        if isinstance(value, (pd.Timestamp, datetime)):
            return value.isoformat()
        if isinstance(value, (np.int64, np.int32)):
            return int(value)
        if isinstance(value, (np.float64, np.float32)):
            if np.isinf(value):
                return None
            return float(value)
        return value

    json_data = df.reset_index().to_dict(orient='records')
    processed_data = [
        {k: convert_value(v) for k, v in record.items()} for record in json_data
    ]
    return processed_data

# Upbit API에서 분 단위 캔들 데이터를 가져오는 함수
def get_minute_candle_data(market: str, unit: int = 240, count: int = 30, to: str = None) -> Optional[pd.DataFrame]:
    url = f"https://api.upbit.com/v1/candles/minutes/{unit}"
    headers = {"Accept": "application/json"}
    params = {"market": market, "count": count}
    if to:
        params["to"] = to

    try:
        response = requests.get(url, headers=headers, params=params)
        response.raise_for_status()
        data = response.json()
        df = pd.DataFrame(data)
        df['candle_date_time_kst'] = pd.to_datetime(df['candle_date_time_kst'])
        df.set_index('candle_date_time_kst', inplace=True)
        df = df[['trade_price', 'high_price', 'low_price', 'opening_price', 'candle_acc_trade_volume']].rename(columns={
            "trade_price": "close",
            "high_price": "high",
            "low_price": "low",
            "opening_price": "open",
            "candle_acc_trade_volume": "volume"
        }).dropna()
        numeric_columns = ['close', 'high', 'low', 'open', 'volume']
        df[numeric_columns] = df[numeric_columns].apply(pd.to_numeric, errors='coerce')
        return df
    except requests.RequestException as e:
        print(f"Error fetching data from Upbit: {e}")
        return None

def quant_agent(state: State) -> State:
    try:
        candle_data = df_to_json(get_minute_candle_data("KRW-BTC", 240))
        result = quant_chain.invoke({"candle_data": candle_data})

        return {
            "quant": {
                "decision": result["decision"],
                "summary": result["summary"],
                "raw_data": df_to_json(candle_data),
            }
        }

    except Exception as e:
        print(f"Error in quant_agent: {e}")
        return state