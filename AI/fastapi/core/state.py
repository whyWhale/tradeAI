from pydantic import BaseModel
from typing import List, Optional, Annotated
from langgraph.graph.message import add_messages


class State(BaseModel):
    messages: Annotated[list, add_messages]
    fng: Optional[dict] = None
    news_search: Optional[dict] = None
    quant: Optional[dict] = None
    master: Optional[dict] = None

    def copy(self, update=None):
        if update is None:
            update = {}
        data = self.dict()
        data.update(update)
        return State(**data)
