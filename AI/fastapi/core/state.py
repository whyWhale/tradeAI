from pydantic import BaseModel
from typing import List, Optional, Annotated
from langgraph.graph.message import add_messages
import operator


class State(BaseModel):
    metadata: Optional[dict] = None
    user_info: Optional[dict] = None
    decision_maker: Annotated[dict, operator.or_] = {}
    portfolio: Annotated[dict, operator.or_] = {}
    # messages: Annotated[list, add_messages] = []
    fng: Annotated[dict, operator.or_] = {}
    news_search: Annotated[dict, operator.or_] = {}
    chart_pattern: Annotated[dict, operator.or_] = {}
    quant: Annotated[dict, operator.or_] = {}