# ----------------------------
# Build stage
# ----------------------------
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# ---- build args (same pattern as Vite envs)
ARG VITE_APP_BASE_PATH=/
ARG VITE_API_BASE_PATH=/api
ARG BACKEND_UPSTREAM=http://backend:8080

# ---- expose to Vite build
ENV VITE_APP_BASE_PATH=$VITE_APP_BASE_PATH
ENV VITE_API_BASE_PATH=$VITE_API_BASE_PATH

RUN npm run build

# ----------------------------
# Runtime stage (nginx)
# ----------------------------
FROM nginx:alpine

# ---- runtime arg
ARG BACKEND_UPSTREAM=http://backend:8080

# ---- expose to nginx via env
ENV BACKEND_UPSTREAM=$BACKEND_UPSTREAM

# Copy built app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80