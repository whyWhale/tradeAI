FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache tzdata

RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base

COPY package*.json ./

RUN npm install

ARG VITE_ENV_FILE
ENV VITE_ENV_FILE=$VITE_ENV_FILE

RUN echo "**********************"
RUN echo "$VITE_ENV_FILE"
RUN echo "**********************"

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]