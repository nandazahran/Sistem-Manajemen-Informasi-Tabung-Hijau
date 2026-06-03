# ====================================================
# TAHAP 1: Koki Inti (Persiapan Alat & System Dependencies)
# ====================================================
FROM rust:1.96.0-slim-trixie AS chef
# Install tool cargo-chef dan dependencies C untuk compile keamanan (OpenSSL)
RUN apt-get update && apt-get install -y pkg-config libssl-dev && rm -rf /var/lib/apt/lists/*
RUN cargo install cargo-chef
WORKDIR /app

# ====================================================
# TAHAP 2: Perencana (Membuat daftar library)
# ====================================================
FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

# ====================================================
# TAHAP 3: Tukang Masak (Merakit library SAJA)
# ====================================================
FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json

# Build bumbu dasar (Dependencies). Selama Cargo.toml tidak berubah, 
# Docker akan me-nge-cache baris ini selamanya!
RUN cargo chef cook --release --recipe-path recipe.json

# Barulah kita salin kodemu (src/main.rs dll)
COPY . .
# Kompilasi aplikasi utama (Sangat cepat karena library sudah jadi)
RUN cargo build --release

# ====================================================
# TAHAP 4: Server Production (Runtime Trixie)
# ====================================================
FROM debian:trixie-slim
WORKDIR /app
# Install sertifikat dan eksekutor OpenSSL untuk runtime
RUN apt-get update && apt-get install -y openssl ca-certificates && rm -rf /var/lib/apt/lists/*

# Salin binary hasil kompilasi. 
# (Pastikan "sim-th-backend" sesuai dengan nama di Cargo.toml kalian)
COPY --from=builder /app/target/release/sim-th-backend .

EXPOSE 3000
CMD ["./sim-th-backend"]