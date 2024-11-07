from fastapi import FastAPI, HTTPException, APIRouter
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timedelta
from langgraph.graph import StateGraph, START, END
from core.state import State
from agents.fng import fng_agent
from agents.news_search import news_search_agent
from agents.quant import quant_agent
from agents.chart_pattern import chart_pattern_agent
from agents.master import master_agent
from core.logging import langsmith


# Configuration
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://www.trai-ai.site"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
router = APIRouter(prefix="/ai")
langsmith(project_name="trai-v1", set_enable=True)


# Graph
graph_builder = StateGraph(State)
graph_builder.add_node("fng_agent", fng_agent)
graph_builder.add_node("news_search_agent", news_search_agent)
graph_builder.add_node("quant_agent", quant_agent)
graph_builder.add_node("chart_pattern_agent", chart_pattern_agent)
graph_builder.add_node("master_agent", master_agent)

# 직렬
# graph_builder.add_edge(START, "fng_agent")
# graph_builder.add_edge("fng_agent", "news_search_agent")
# graph_builder.add_edge("news_search_agent", "quant_agent")
# graph_builder.add_edge("quant_agent", "chart_pattern_agent")

# 병렬
graph_builder.add_edge(START, "fng_agent")
graph_builder.add_edge(START, "news_search_agent")
graph_builder.add_edge(START, "quant_agent")
graph_builder.add_edge(START, "chart_pattern_agent")

graph_builder.add_edge("fng_agent", "master_agent")
graph_builder.add_edge("news_search_agent", "master_agent")
graph_builder.add_edge("quant_agent", "master_agent")
graph_builder.add_edge("chart_pattern_agent", "master_agent")

graph_builder.add_edge("master_agent", END)
graph = graph_builder.compile()

# Controller
class UserInfo(BaseModel):
    user_id: int
    available_amount: float
    btc_balance_krw: float

@router.post("/analysis")
async def run_analysis(user_info: UserInfo):
    try:
        initial_state = State(
            messages=["Analysis Started"],
            user_info=user_info.dict(),
            metadata={"date": (datetime.utcnow() + timedelta(hours=9)).isoformat()}
        )
        result_state = graph.invoke(initial_state)
        # messages를 제외하고 반환
        result_dict = dict(result_state)
        result_dict.pop('messages', None)
        return result_dict
    except Exception as e:
        print("API 처리 중 오류 발생:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/reports")
async def run_analysis():
    try:
        user_info = UserInfo(
            user_id=12345,
            available_amount=1000000.0,
            btc_balance_krw=500000.0
        )

        initial_state = State(
            messages=["Analysis Started"],
            user_info=user_info.dict(),
            metadata={"date": (datetime.utcnow() + timedelta(hours=9)).isoformat()}
        )
        result_state = graph.invoke(initial_state)
        # messages를 제외하고 반환
        result_dict = dict(result_state)
        result_dict.pop('messages', None)
        return result_dict
    except Exception as e:
        print("API 처리 중 오류 발생:", str(e))
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# uvicorn main:app --host 0.0.0.0 --port 8000 --reload
