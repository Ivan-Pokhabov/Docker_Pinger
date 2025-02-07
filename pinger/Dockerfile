FROM golang:1.22 AS builder

WORKDIR /app

COPY pinger/go.mod pinger/go.sum ./

RUN go mod download

COPY pinger/pinger.go .

RUN go build -o pinger

FROM ubuntu:22.04

WORKDIR /app

RUN apt update && apt install -y ca-certificates && rm -rf /var/lib/apt/lists/*

COPY --from=builder /app/pinger .

CMD ["./pinger"]
