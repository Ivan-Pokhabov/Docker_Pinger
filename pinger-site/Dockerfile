FROM node:20 AS builder

WORKDIR /app

COPY pinger-site/package.json pinger-site/package-lock.json ./

RUN npm install

COPY pinger-site ./

RUN npm run build

FROM nginx:alpine

WORKDIR /usr/share/nginx/html

RUN mkdir -p /app/build

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
