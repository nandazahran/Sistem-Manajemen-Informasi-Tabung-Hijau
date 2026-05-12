# 🌿 Setup Project Tabung Hijau
Dokumen ini berisi panduan foolproof untuk menjalankan project Tabung Hijau secara lokal untuk keperluan testing.

Agar proses testing lancar di OS apapun (Windows, Mac, Linux) tanpa perlu install toolchain Rust atau konfigurasi database secara manual, bagian Backend & Database dijalankan sepenuhnya menggunakan Docker. Sementara untuk Frontend, kita menggunakan standar Node.js (Vite + React).

## 🛠️ Persyaratan Sistem (Prerequisites)
Pastikan hal-hal berikut sudah terinstall di laptop/komputer kamu:

Docker/Podman (Kalau bingung langsung gunakan [Docker Desktop](https://www.docker.com/products/docker-desktop/)).

Node.js & npm (Minimal versi 18+ untuk menjalankan Vite).

## 🔐 Langkah 1: Setup Environment Variables (.env)
Project ini menggunakan file .env untuk menyimpan konfigurasi koneksi database dan URL API. Secara default, file ini tidak ikut ter-upload ke Git, jadi kamu harus membuatnya terlebih dahulu dari file contoh yang sudah disediakan.

Copy file `.env.example` pada folder `sim-th-backend` menjadi `.env`:

Lalu Ikuti arahan dalam filenya

## ⚙️ Langkah 2: Menjalankan Backend & Database (Docker)
Backend (Rust) dan Database (PostgreSQL) dibungkus menggunakan container. Kamu tidak perlu menginstall Rust atau setting database sama sekali.

1. Jalankan Container
Buka terminal di folder root project ini, lalu jalankan perintah berikut:

```docker compose up -d --build```

(Catatan: Flag `--build` akan menyuruh Docker untuk meng-compile kode Rust. Proses ini memakan waktu beberapa menit saat pertama kali dijalankan, tunggu saja sampai selesai).

2. Cek Status Container
Pastikan service backend dan db sudah berjalan dengan normal (statusnya Up):

```docker compose ps```

3. Test API
Backend sekarang sudah berjalan dan terkoneksi ke database. API siap di-hit di:

Base URL: http://localhost:3000

Contoh Test Endpoint: Buka browser atau gunakan cURL ke http://localhost:3000/api/kategori

## 💻 Langkah 3: Menjalankan Frontend (UI)
Frontend dibangun menggunakan React dan Vite. Pastikan backend di atas sudah berjalan sebelum menjalankan frontend agar UI bisa mengambil data.

1. Masuk ke Folder Frontend
Buka tab terminal baru (jangan matikan terminal backend), dan masuk ke direktori frontend:

```cd frontend```

2. Install Dependencies
Install semua package Node.js yang dibutuhkan:

```npm install```

3. Jalankan Development Server
Start aplikasi Vite:

```npm run dev```

4. Buka Aplikasi
Vite akan memberikan URL lokal. Buka browser dan klik link tersebut:
👉 http://localhost:5173

Frontend sekarang sudah jalan dan otomatis terhubung ke Backend!

## 🛑 Langkah 4: Mematikan Server
Jika proses testing dari kelompok kalian sudah selesai, jangan hanya menutup aplikasi Docker atau terminalnya.

Matikan container dengan aman agar RAM dan port kalian kembali bersih dengan perintah ini di folder `sim-th-backend`:

```docker compose down```
