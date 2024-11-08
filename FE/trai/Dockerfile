FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache tzdata

RUN apk add --no-cache \
    python3 \
    py3-pip \
    build-base

COPY package*.json ./

RUN npm install

ARG VITE_ENV
ENV VITE_ENV=$VITE_ENV

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]