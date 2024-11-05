from fastapi import FastAPI, HTTPException, APIRouter
from pydantic import BaseModel
from typing import List, Optional
from langgraph.graph import StateGraph, START, END
from core.state import State
from agents.fng import fng_agent
from agents.news_search import news_search_agent
from agents.quant import quant_agent
from agents.chart_pattern import chart_pattern_agent
from agents.master import master_agent
from core.logging import langsmith


app = FastAPI()
router = APIRouter(prefix="/ai")
langsmith(project_name="trai-v1", set_enable=True)

# 그래프 초기화 및 컴파일
graph_builder = StateGraph(State)
graph_builder.add_node("fng_agent", fng_agent)
graph_builder.add_node("news_search_agent", news_search_agent)
graph_builder.add_node("quant_agent", quant_agent)
graph_builder.add_node("chart_pattern_agent", chart_pattern_agent)
graph_builder.add_node("master_agent", master_agent)

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

@router.post("/analysis")
async def run_analysis():
    try:
        initial_state = State(messages=["Analysis Started"])
        result_state = graph.invoke(initial_state)
        result_state = State(**result_state)
        return result_state
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
