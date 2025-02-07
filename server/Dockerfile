FROM golang:1.21.6 AS builder

WORKDIR /app

COPY server/go.mod server/go.sum ./

RUN go mod download

COPY server/server.go .

RUN go build -o server

FROM ubuntu:22.04

WORKDIR /app

RUN apt update && apt install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/server .

EXPOSE 4000

CMD ["./server"]
