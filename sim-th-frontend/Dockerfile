# ---------------------------------------------------
# STAGE 1: Builder
# ---------------------------------------------------
# Kita gunakan Node.js berbasis Debian Trixie Slim
FROM node:26.3-trixie-slim AS builder
WORKDIR /app

# Copy package.json dulu untuk mengoptimalkan cache Docker
COPY package*.json ./

# Install semua dependensi (termasuk Vite)
RUN npm install

# Copy seluruh kode sumber (UI, komponen, dll)
COPY . .

# Tangkap argumen dari docker-compose
ARG VITE_API_URL

# Jadikan environment variable sesaat agar Vite bisa membacanya saat proses build
ENV VITE_API_URL=$VITE_API_URL

# Eksekusi Vite untuk meracik kode menjadi file statis
# Hasilnya akan otomatis tersimpan di folder /app/dist
RUN npm run build 

# ---------------------------------------------------
# STAGE 2: Production Server
# ---------------------------------------------------
# Kita gunakan Nginx berbasis Debian Trixie
FROM nginx:1.31.1-trixie

# Timpa konfigurasi bawaan Nginx dengan milik kita yang sudah mendukung SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Bersihkan halaman default bawaan Nginx
RUN rm -rf /usr/share/nginx/html/*

# Pindahkan file statis hasil masakan dari Stage 1 ke dalam Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Ekspos port standar web
EXPOSE 80

# Jalankan Nginx agar menyala terus-menerus di latar belakang
CMD ["nginx", "-g", "daemon off;"]