FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    firefox-esr \
    libx11-xcb1 \
    libdbus-glib-1-2 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN chmod +x /app/core/geckodriver-v0.35.0-linux-aarch64/geckodriver

RUN mkdir -p images

EXPOSE 8000

CMD uvicorn main:app --host 0.0.0.0 --port 8000