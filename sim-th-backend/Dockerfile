# Stage 1: Build the Rust binary
FROM rust:1.75-slim as builder
WORKDIR /app
COPY . .
# This compiles the app. It will take a few minutes on their machines.
RUN cargo build --release

# Stage 2: Create a tiny image to run the app
FROM debian:bookworm-slim
WORKDIR /app
# Install OpenSSL in case your backend needs it for web requests
RUN apt-get update && apt-get install -y libssl3 && rm -rf /var/lib/apt/lists/*
# Copy the compiled binary from the builder stage
COPY --from=builder /app/target/release/sim-th-backend .
# Expose your API port
EXPOSE 3000
# Run the binary
CMD ["./sim-th-backend"]