# Stage 1: Build the Rust binary
FROM rust:1.96.0-slim-trixie as builder
WORKDIR /app

# Install system dependencies needed for compiling Rust on Debian
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
COPY . .
# This compiles the app. It will take a few minutes on their machines.
RUN cargo build --release

# Stage 2: Create a tiny image to run the app
FROM debian:trixie-slim
WORKDIR /app
# Install OpenSSL and CA certificates for runtime web requests
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*
# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/sim-th-backend .
# Expose your API port
EXPOSE 3000
# Run the binary
CMD ["./sim-th-backend"]