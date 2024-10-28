# Build stage
FROM node:18-alpine AS build

# 작업 디렉토리 설정
WORKDIR /app

# package.json만 복사하여 의존성 설치
COPY FE/trai/package*.json ./
RUN npm install

# 전체 파일 복사 및 빌드 실행
COPY FE/trai /app
RUN npm run build

# Production stage
FROM nginx:alpine

# Nginx 설정 파일 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 결과물을 Nginx의 기본 HTML 디렉토리에 복사
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]
