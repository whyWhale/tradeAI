import requests
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional, Tuple, Literal
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm
from core.state import State


# 프롬프트 템플릿 설정
quant_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    현재 당신 회사는 4시간 마다 자동으로 비트코인 투자 결정을 내려야 합니다.
    당신은 기술적 분석을 통해 투자 의사결정을 내려야 합니다.
    현재 4시간 단위 캔들 데이터를 통해 골든 크로스 & 데드 크로스 판단, RSI 과매수/과매도 판단, MACD 교차 판단, 볼린저 밴드 판단을 합니다.
    
    현재 4시간 캔들 데이터를 바탕으로 분석한 결과는 다음과 같습니다:
    {analysis}
    
    해당 부분을 고려해서, 투자 결정 및 투자 결정에 대한 이유를 제공해주세요.

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "투자 결정에 대한 이유를 자세히 서술"
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
def get_minute_candle_data(market: str, unit: int = 240, count: int = 200, to: str = None) -> Optional[pd.DataFrame]:
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

# 기술적 지표 계산 함수들
def calculate_sma(data: pd.DataFrame, window: int) -> pd.Series:
    return data['close'].rolling(window=window, min_periods=1).mean()

def calculate_rsi(data: pd.DataFrame, window: int = 14) -> pd.Series:
    delta = data['close'].diff(1)
    gain = delta.where(delta > 0, 0)
    loss = -delta.where(delta < 0, 0)
    avg_gain = gain.rolling(window=window, min_periods=1).mean()
    avg_loss = loss.rolling(window=window, min_periods=1).mean()
    rs = avg_gain / avg_loss
    return 100 - (100 / (1 + rs))

def calculate_macd(data: pd.DataFrame, short_window: int = 12, long_window: int = 26, signal_window: int = 9) -> Tuple[pd.Series, pd.Series]:
    short_ema = data['close'].ewm(span=short_window, min_periods=1, adjust=False).mean()
    long_ema = data['close'].ewm(span=long_window, min_periods=1, adjust=False).mean()
    macd = short_ema - long_ema
    signal = macd.ewm(span=signal_window, min_periods=1, adjust=False).mean()
    return macd, signal

def calculate_bollinger_bands(data: pd.DataFrame, window: int = 20) -> Tuple[pd.Series, pd.Series]:
    sma = data['close'].rolling(window=window, min_periods=1).mean()
    std_dev = data['close'].rolling(window=window, min_periods=1).std()
    upper_band = sma + (std_dev * 2)
    lower_band = sma - (std_dev * 2)
    return upper_band, lower_band

# 시장 분석 함수
def analyze_market(market: str, unit: int = 240) -> Tuple[str, pd.DataFrame]:
    df = get_minute_candle_data(market, unit)
    if df is None:
        raise ValueError("Failed to fetch market data")

    analysis_df = df.copy()
    analysis_df['SMA50'] = calculate_sma(analysis_df, 50)
    analysis_df['SMA200'] = calculate_sma(analysis_df, 200)
    analysis_df['RSI'] = calculate_rsi(analysis_df)
    analysis_df['MACD'], analysis_df['Signal'] = calculate_macd(analysis_df)
    analysis_df['Upper_BB'], analysis_df['Lower_BB'] = calculate_bollinger_bands(analysis_df)

    latest_data = analysis_df.iloc[-1]
    analysis = []
    if latest_data['SMA50'] > latest_data['SMA200']:
        analysis.append("골든 크로스가 발생")
    elif latest_data['SMA50'] < latest_data['SMA200']:
        analysis.append("데드 크로스가 발생")

    if latest_data['RSI'] > 70:
        analysis.append("RSI 과매수 상태")
    elif latest_data['RSI'] < 30:
        analysis.append("RSI 과매도 상태")

    if latest_data['MACD'] > latest_data['Signal']:
        analysis.append("MACD 상승 교차 상태")
    elif latest_data['MACD'] < latest_data['Signal']:
        analysis.append("MACD 하락 교차 상태")

    if latest_data['close'] > latest_data['Upper_BB']:
        analysis.append("볼린저 밴드 상단 돌파")
    elif latest_data['close'] < latest_data['Lower_BB']:
        analysis.append("볼린저 밴드 하단 돌파")

    analysis_text = ". ".join(analysis) + "."
    return analysis_text, df

def quant_agent(state: State) -> State:
    try:
        analysis_text, raw_data = analyze_market("KRW-BTC", unit=240)
        result = quant_chain.invoke({"analysis": analysis_text})

        return {
            "quant": {
                "decision": result["decision"],
                "summary": result["summary"],
                "raw_data": df_to_json(raw_data),
            }
        }

    except Exception as e:
        print(f"Error in quant_agent: {e}")
        return state
