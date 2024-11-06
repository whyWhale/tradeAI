from dotenv import load_dotenv
from langchain_openai import ChatOpenAI


load_dotenv()

# LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)
llm_gpt_4 = ChatOpenAI(model="gpt-4", temperature=0)
llm_gpt_4o = ChatOpenAI(model="gpt-4o", temperature=0)