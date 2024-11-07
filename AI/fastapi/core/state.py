from pydantic import BaseModel
from typing import List, Optional, Annotated
from langgraph.graph.message import add_messages


class State(BaseModel):
    metadata: Optional[dict] = None # 분석 완료 날짜
    user_info: Optional[dict] = None # 유저 아이디, 주문 가능 금액, 보유 비트코인 원화
    messages: Annotated[list, add_messages]
    fng: Optional[dict] = None
    news_search: Optional[dict] = None
    quant: Optional[dict] = None
    chart_pattern: Optional[dict] = None
    master: Optional[dict] = None

    def copy(self, update=None):
        if update is None:
            update = {}
        data = self.dict()
        data.update(update)
        return State(**data)
