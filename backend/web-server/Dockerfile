FROM rust:1.86-slim AS builder
WORKDIR /app

RUN apt-get update && apt-get install -y pkg-config libssl-dev && \
  cargo install trunk

COPY . .
ENV SQLX_OFFLINE=true

RUN cargo build --release --bin web-server


FROM rust:1.84-slim
WORKDIR /app

COPY --from=builder /app/target/release/web-server /app/web-server

EXPOSE 8080
CMD ["./web-server"]
