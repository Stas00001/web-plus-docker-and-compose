FROM node:16-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build && rm -rf ./src/ \
    && rm -rf node ./node_modules/

FROM nginx:latest AS frontend

WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 8081
CMD ["nginx", "-g", "daemon off;"]