# 🌿 Setup Project Tabung Hijau
Dokumen ini berisi panduan untuk menjalankan project Tabung Hijau secara lokal untuk keperluan testing.

Agar proses testing lancar di OS apapun (Windows, Mac, Linux) tanpa perlu install toolchain Rust atau konfigurasi database secara manual, bagian Backend & Database dijalankan sepenuhnya menggunakan Docker. Sementara untuk Frontend, kita menggunakan standar Node.js (Vite + React).

## 🛠️ Persyaratan Sistem (Prerequisites)
Pastikan hal-hal berikut sudah terinstall di laptop/komputer kamu:

Docker/Podman (Kalau bingung langsung gunakan [Docker Desktop](https://www.docker.com/products/docker-desktop/)).

Node.js & npm (Minimal versi 18+ untuk menjalankan Vite).

## 🔐 Langkah 1: Setup Environment Variables (.env)
Project ini menggunakan file .env untuk menyimpan konfigurasi koneksi database dan URL API. Secara default, file ini tidak ikut ter-upload ke Git, jadi kamu harus membuatnya terlebih dahulu dari file contoh yang sudah disediakan.

Pindahkan/copy file `.env.example` dari folder `sim-th-backend` menjadi `.env` di **folder utama (root)** project:

Lalu Ikuti arahan dalam filenya

## ⚙️ Langkah 2: Menjalankan Keseluruhan Project (Docker)
Backend (Rust), Frontend (Vite), dan Database (PostgreSQL) dibungkus menggunakan container. Kamu tidak perlu menginstall Rust, Node.js, atau setting database sama sekali.

### 1. Jalankan Container
Buka terminal di folder utama (root) project ini, lalu jalankan perintah berikut:

```docker compose up -d --build``` *(atau `podman compose up -d --build`)*

(Catatan: Flag `--build` akan menyuruh Docker untuk meng-compile kode Rust dan Node.js. Proses ini memakan waktu beberapa menit saat pertama kali dijalankan, tunggu saja sampai selesai).

### 2. Cek Status Container
Pastikan service db, backend, dan frontend sudah berjalan dengan normal (statusnya Up):

```docker compose ps``` *(atau `podman compose ps`)*

### 3. Test API
Backend sekarang sudah berjalan dan terkoneksi ke database. API (Backend) siap di-hit di:

Base URL: http://localhost:3000

Contoh Test Endpoint: Buka browser atau gunakan cURL ke http://localhost:3000

### 4. Buka Aplikasi Frontend (UI)
Container frontend Vite otomatis akan dijalankan pada port 5173. Buka browser dan klik link tersebut:
👉 http://localhost:5173

## 🛑 Langkah 4: Mematikan Server
Jika proses testing sudah selesai, jangan hanya menutup aplikasi Docker atau terminalnya.

Matikan container dengan aman agar RAM dan port kalian kembali bersih dengan perintah ini di folder utama:

```docker compose down``` *(atau `podman compose down`)*

## 🖥️ Alternatif: Menjalankan Backend Secara Lokal (Tanpa Docker Rust)
Jika kamu ingin mendevelop backend dengan instalasi Rust lokal (native), ikuti panduan berikut:

### 1. Prasyarat
Pastikan kamu sudah menginstall toolchain Rust melalui [rustup](https://rustup.rs/).

### 2. Jalankan Database Secara Terpisah
Nyalakan hanya container database dari folder utama:
```sh
# Jika menggunakan Podman, gunakan: podman compose up -d db_sim_th
docker compose up -d db_sim_th
```

### 3. Konfigurasi `.env`
Buka file `.env` di dalam folder `sim-th-backend`. Karena Docker compose di-set mem-forward port ke **5433**, pastikan URL database kamu mengarah ke `localhost:5433`:
```env
DATABASE_URL=postgres://[USER]:[PASSWORD]@localhost:5433/[DB_NAME]
```
*(Ganti bagian dalam kurung siku sesuai dengan isi `DB_USER`, `DB_PASSWORD`, dan `DB_NAME` kamu).*

### 4. Jalankan Migrasi Database
Sistem menggunakan SeaORM untuk migrasi. Masuk ke folder `migration` dan eksekusi migrasinya:
```sh
cd migration
cargo run -- up
cd ..
```

### 5. Jalankan Backend Server
Di dalam folder `sim-th-backend`, jalankan server Rust kamu:
```sh
cargo run
```
