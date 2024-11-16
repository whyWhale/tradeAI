import requests
import pandas as pd
import numpy as np
from datetime import datetime
from typing import Optional, Literal, Dict, Any, Tuple
from pydantic import BaseModel
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from core.config import llm_gpt_4 as llm
from core.state import State


# 프롬프트 템플릿 설정
quant_template = """당신은 비트코인 시장의 투자 분석 전문가입니다.
    현재 당신은 4시간 마다 자동으로 비트코인 투자 결정을 내리고 있습니다.

    당신은 퀀트 분석가로 4시간 봉과 일봉 데이터를 모두 활용하여 현재 투자 의사결정을 내려야 합니다.
    수치적으로 분석한 결과는 다음과 같습니다:
    
    [4시간 봉 분석]
    {hour4_analysis}

    [일봉 분석]
    {daily_analysis}

    결과는 반드시 JSON 형식으로 출력하세요:
    {{
        "decision": "BUY 또는 SELL 또는 HOLD 중 하나로만 작성",
        "summary": "알고리즘 분석으로 투자 결정에 대한 이유를 자세히 서술. 구체적인 수치를 제공"
    }}
    """

class QuantAnalysis(BaseModel):
    summary: str
    decision: Literal["BUY", "SELL", "HOLD"]

quant_prompt_template = PromptTemplate.from_template(quant_template)
quant_output_parser = JsonOutputParser(pydantic_object=QuantAnalysis)
quant_chain = quant_prompt_template | llm | quant_output_parser

# DataFrame을 JSON으로 변환하는 함수
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

# Upbit API에서 일 단위 캔들 데이터를 가져오는 함수
def get_daily_candle_data(market: str, count: int = 60, to: str = None) -> Optional[pd.DataFrame]:
    url = "https://api.upbit.com/v1/candles/days"
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
        print(f"Error fetching daily candle data from Upbit: {e}")
        return None

# 기술적 지표 계산 함수
def calculate_technical_indicators(df: pd.DataFrame, is_daily: bool = False) -> pd.DataFrame:
    
    df = df.sort_index(ascending=True)
    
    # 이동평균선
    if is_daily:
        windows = {'short': 5, 'mid': 20, 'long': 60}  # 일봉
    else:
        windows = {'short': 30, 'mid': 120, 'long': 360}  # 4시간봉
        
    df[f'SMA_{windows["short"]}'] = df['close'].rolling(window=windows['short']).mean()
    df[f'SMA_{windows["mid"]}'] = df['close'].rolling(window=windows['mid']).mean()
    df[f'SMA_{windows["long"]}'] = df['close'].rolling(window=windows['long']).mean()
    
    # MACD
    if is_daily:
        ema_short, ema_long, signal = 12, 26, 9
    else:
        ema_short, ema_long, signal = 72, 156, 54
        
    df['EMA_short'] = df['close'].ewm(span=ema_short, adjust=False).mean()
    df['EMA_long'] = df['close'].ewm(span=ema_long, adjust=False).mean()
    df['MACD'] = df['EMA_short'] - df['EMA_long']
    df['MACD_Signal'] = df['MACD'].ewm(span=signal, adjust=False).mean()
    df['MACD_Histogram'] = df['MACD'] - df['MACD_Signal']
    
    # RSI
    window = 14 if is_daily else 84
    delta = df['close'].diff()
    gain = (delta.where(delta > 0, 0)).rolling(window=window).mean()
    loss = (-delta.where(delta < 0, 0)).rolling(window=window).mean()
    rs = gain / loss
    df['RSI'] = 100 - (100 / (1 + rs))
    
    # 볼린저 밴드
    window = 20 if is_daily else 120
    df['BB_middle'] = df['close'].rolling(window=window).mean()
    df['BB_std'] = df['close'].rolling(window=window).std()
    df['BB_upper'] = df['BB_middle'] + (df['BB_std'] * 2)
    df['BB_lower'] = df['BB_middle'] - (df['BB_std'] * 2)
    
    return df.sort_index(ascending=False)

def analyze_market_data(df: pd.DataFrame, is_daily: bool = False) -> Dict[str, Any]:
    # 지표 만들기
    df = calculate_technical_indicators(df, is_daily)
    
    current = df.iloc[0]  # 가장 최신 데이터
    previous = df.iloc[1]  # 직전 데이터
    
    # NaN 안전 변환 함수
    def safe_int(value):
        return int(value) if pd.notnull(value) else 0
    
    def safe_round(value, decimals=2):
        return round(float(value), decimals) if pd.notnull(value) else 0.0
    
    price_change = ((current['close'] - previous['close']) / previous['close'] * 100)
    
    period = "일" if is_daily else "4시간"
    sma_short = 5 if is_daily else 30
    sma_mid = 20 if is_daily else 120
    sma_long = 60 if is_daily else 360
    
    analysis = {
        '기준시간': current.name.strftime('%Y-%m-%d %H:%M'),
        '현재가격': safe_int(current['close']),
        '전봉대비': f"{safe_round(price_change)}%",
        '거래량': safe_int(current['volume']),
        '이동평균선': {
            f'SMA_{sma_short}': safe_int(current[f'SMA_{sma_short}']),
            f'SMA_{sma_mid}': safe_int(current[f'SMA_{sma_mid}']),
            f'SMA_{sma_long}': safe_int(current[f'SMA_{sma_long}'])
        },
        'MACD': {
            'MACD': safe_round(current['MACD']),
            'Signal': safe_round(current['MACD_Signal']),
            'Histogram': safe_round(current['MACD_Histogram'])
        },
        'RSI': safe_round(current['RSI']),
        '볼린저밴드': {
            '상단': safe_int(current['BB_upper']),
            '중간': safe_int(current['BB_middle']),
            '하단': safe_int(current['BB_lower'])
        },
        '기술적신호': {
            '이동평균배열': 'UPTREND' if (pd.notnull(current[f'SMA_{sma_short}']) and 
                                    pd.notnull(current[f'SMA_{sma_mid}']) and 
                                    pd.notnull(current[f'SMA_{sma_long}']) and 
                                    current[f'SMA_{sma_short}'] > current[f'SMA_{sma_mid}'] > current[f'SMA_{sma_long}']) else 
                        'DOWNTREND' if (pd.notnull(current[f'SMA_{sma_short}']) and 
                                    pd.notnull(current[f'SMA_{sma_mid}']) and 
                                    pd.notnull(current[f'SMA_{sma_long}']) and 
                                    current[f'SMA_{sma_short}'] < current[f'SMA_{sma_mid}'] < current[f'SMA_{sma_long}']) else 'SIDEWAYS',
            'MACD신호': 'BULLISH_CROSS' if (pd.notnull(current['MACD']) and 
                                        pd.notnull(current['MACD_Signal']) and 
                                        current['MACD'] > current['MACD_Signal']) else 'BEARISH_CROSS',
            'RSI상태': 'OVERSOLD' if (pd.notnull(current['RSI']) and current['RSI'] < 30) else 
                      'OvERBOUGHT' if (pd.notnull(current['RSI']) and current['RSI'] > 70) else 'NEUTRAL',
            '볼린저위치': 'ABOVE_UPPER' if (pd.notnull(current['close']) and 
                                    pd.notnull(current['BB_upper']) and 
                                    current['close'] > current['BB_upper']) else 
                       'BELOW_LOWER' if (pd.notnull(current['close']) and 
                                    pd.notnull(current['BB_lower']) and 
                                    current['close'] < current['BB_lower']) else 'INSIDE_BAND',
        }
    }
    
    return analysis

def format_analysis_for_prompt(analysis: Dict[str, Any], is_daily: bool = False) -> str:
    period = "일봉" if is_daily else "4시간봉"
    
    return f"""
        {period} 분석 결과 (기준시간: {analysis['기준시간']})
        1. 가격 동향:
        - 현재가: {analysis['현재가격']:,}원
        - 전봉 대비: {analysis['전봉대비']} 변동
        - 거래량: {analysis['거래량']:,.2f}

        2. 이동평균선 분석:
        - 단기 이평선: {list(analysis['이동평균선'].values())[0]:,}원
        - 중기 이평선: {list(analysis['이동평균선'].values())[1]:,}원
        - 장기 이평선: {list(analysis['이동평균선'].values())[2]:,}원
        - 이동평균 배열: {analysis['기술적신호']['이동평균배열']}

        3. MACD 지표:
        - MACD: {analysis['MACD']['MACD']}
        - 시그널: {analysis['MACD']['Signal']}
        - 히스토그램: {analysis['MACD']['Histogram']}
        - 신호: {analysis['기술적신호']['MACD신호']}

        4. RSI 분석:
        - RSI 값: {analysis['RSI']}
        - 상태: {analysis['기술적신호']['RSI상태']}

        5. 볼린저 밴드:
        - 상단: {analysis['볼린저밴드']['상단']:,}원
        - 중간: {analysis['볼린저밴드']['중간']:,}원
        - 하단: {analysis['볼린저밴드']['하단']:,}원
        - 현재 위치: {analysis['기술적신호']['볼린저위치']}
        """


def quant_agent(state: State) -> State:
    try:
        # 정보 가져오기
        hour4_data = get_minute_candle_data(market="KRW-BTC", unit=240, count=200) # 200개 최대
        daily_data = get_daily_candle_data(market="KRW-BTC", count=60)

        if hour4_data is None or daily_data is None:
            raise Exception("Failed to fetch market data")
        
        # 4시간봉과 일봉 분석하기
        hour4_analysis = analyze_market_data(hour4_data, is_daily=False)
        daily_analysis = analyze_market_data(daily_data, is_daily=True)
        
        # 분석 결과를 프롬프트용 텍스트로 변환
        hour4_formatted = format_analysis_for_prompt(hour4_analysis, is_daily=False)
        daily_formatted = format_analysis_for_prompt(daily_analysis, is_daily=True)

        result = quant_chain.invoke({
            "hour4_analysis": hour4_formatted,
            "daily_analysis": daily_formatted
        })

        return {
            "quant": {
                "decision": result["decision"],
                "summary": result["summary"],
                "hour4_analysis": hour4_analysis,
                "daily_analysis": daily_analysis,
                "raw_data": df_to_json(hour4_data),
            }
        }

    except Exception as e:
        print(f"Error in quant_agent: {e}")
        return state