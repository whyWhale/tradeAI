import os

# Teddy Note에서 가져온 코드입니다.
# 출처: https://github.com/teddylee777/langchain-teddynote


def langsmith(project_name=None, set_enable=True):

    if set_enable:
        result = os.environ.get("LANGCHAIN_API_KEY")
        if result is None or result.strip() == "":
            print(
                "LangChain API Key가 설정되지 않았습니다."
            )
            return
        os.environ["LANGCHAIN_ENDPOINT"] = (
            "https://api.smith.langchain.com"
        )
        os.environ["LANGCHAIN_TRACING_V2"] = "true"  # 활성화
        os.environ["LANGCHAIN_PROJECT"] = project_name  # 프로젝트명
        print(f"LangSmith 추적을 시작합니다.\n[프로젝트명]\n{project_name}")
    else:
        os.environ["LANGCHAIN_TRACING_V2"] = "false" # 비활성화
        print("LangSmith 추적을 하지 않습니다.")


def env_variable(key, value):
    os.environ[key] = value