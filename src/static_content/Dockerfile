FROM node:20-alpine AS builder

WORKDIR /app

COPY pronto-static/package*.json ./
RUN npm install

COPY pronto-static/vite.config.ts ./
COPY pronto-static/src/vue ./src/vue
COPY pronto-static/src/static_content/assets ./src/static_content/assets

RUN npm run build:employees && npm run build:clients

FROM nginx:1.25-alpine

RUN rm /etc/nginx/conf.d/default.conf
COPY pronto-static/src/static_content/nginx.conf /etc/nginx/conf.d/default.conf
COPY pronto-static/src/static_content/index.html /usr/share/nginx/html/index.html
COPY pronto-static/src/static_content/styles.css /usr/share/nginx/html/styles.css

COPY --from=builder /app/src/static_content/assets /usr/share/nginx/html/assets

RUN chmod -R a+rX /usr/share/nginx/html/assets
