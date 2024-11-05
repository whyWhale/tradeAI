from dotenv import load_dotenv
from langchain_openai import ChatOpenAI


load_dotenv()

# LLM
llm = ChatOpenAI(model="gpt-4o", temperature=0)