FROM node:24-alpine AS builder

WORKDIR /app

ARG VITE_APP_BASE_PATH=/rag
ARG VITE_API_BASE_PATH=/rag

ENV VITE_APP_BASE_PATH=${VITE_APP_BASE_PATH}
ENV VITE_API_BASE_PATH=${VITE_API_BASE_PATH}

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.27-alpine

ARG VITE_APP_BASE_PATH=/rag
ENV APP_BASE_PATH=${VITE_APP_BASE_PATH}
ENV BACKEND_UPSTREAM=http://backend:8080

COPY --from=builder /app/dist /tmp/dist

RUN mkdir -p "/usr/share/nginx/html${VITE_APP_BASE_PATH}" \
    && cp -r /tmp/dist/* "/usr/share/nginx/html${VITE_APP_BASE_PATH}/" \
    && rm -rf /tmp/dist

COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80