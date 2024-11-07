from pydantic import BaseModel
from typing import List, Optional, Annotated
from langgraph.graph.message import add_messages
import operator


class State(BaseModel):
    metadata: Optional[dict] = None # 분석 완료 날짜
    user_info: Optional[dict] = None # 유저 아이디, 주문 가능 금액, 보유 비트코인 원화
    master: Annotated[dict, operator.or_] = {}
    # messages: Annotated[list, add_messages] = []
    fng: Annotated[dict, operator.or_] = {}
    news_search: Annotated[dict, operator.or_] = {}
    chart_pattern: Annotated[dict, operator.or_] = {}
    quant: Annotated[dict, operator.or_] = {}