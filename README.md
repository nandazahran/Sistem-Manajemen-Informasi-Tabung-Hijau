# 🌿 Sistem Informasi dan Manajemen Tabung Hijau (SIM-TH)

Sistem Informasi dan Manajemen Tabung Hijau (SIM-TH) adalah platform digital terpadu yang dirancang untuk mengelola, melacak, dan menganalisis data transaksi bank sampah dari berbagai BEM Wilayah di IPB. 

Platform ini memudahkan pencatatan setoran sampah, memantau saldo tabungan wilayah, hingga menampilkan *Leaderboard KPI* secara *real-time* untuk memicu semangat kompetisi yang sehat antar wilayah dalam menjaga lingkungan.

---

## 🎯 Fitur Utama
- **Manajemen Setoran Sampah:** Pencatatan berat dan kategori sampah secara transparan yang otomatis dikonversi menjadi nilai rupiah berdasarkan harga terbaru.
- **Sistem Tabungan Wilayah:** Saldo tabungan setiap wilayah akan otomatis terakumulasi dari setoran dan mendukung fitur penarikan/pencairan dana.
- **Leaderboard KPI (Key Performance Indicator):** Pemeringkatan wilayah secara *real-time* berdasarkan metrik rata-rata kualitas pemilahan, kuantitas sampah, dan nilai ekonomi.
- **Notifikasi & Broadcast:** Sistem pengumuman dan riwayat aktivitas interaktif antar BEM Wilayah dan Administrator.
- **Pemulihan Akun via OTP Email:** Mendukung reset password secara mandiri dan aman menggunakan verifikasi OTP 6 digit yang dikirimkan secara otomatis ke email pengguna (Auto OTP Email).

## 🛠️ Teknologi yang Digunakan
- **Backend:** Rust 🦀, Axum (Web Framework), SeaORM (ORM), Utoipa (Swagger/OpenAPI)
- **Frontend:** React.js, Vite, Tailwind CSS
- **Database:** PostgreSQL
- **Infrastruktur:** Docker / Podman, Cloudflare Zero Trust (Tunnel)
- **CI/CD:** GitHub Actions (Automated Linting, Formatting, & Build to GHCR)

---

##  Pengguna Sistem (Role)
Sistem ini membagi pengguna ke dalam tiga kelompok hak akses utama:
1. **Administrator (BEM KM / Admin):** Memiliki hak akses penuh (*Super Admin*) untuk memantau data seluruh wilayah, mengekspor laporan, mengeksekusi penarikan dana, mengelola pengaturan data (Kategori & Wilayah), serta berhak **mengedit/membatalkan** data transaksi.
2. **Auditor / Pemantau (DUI):** Memiliki hak akses *Read-Only* level-atas. DUI dapat memantau data seluruh IPB, melihat *Leaderboard*, dan mengekspor laporan, namun **dilarang** memanipulasi (mengedit/menghapus) data transaksi.
3. **BEM Wilayah (14 Fakultas/Sekolah):** Memiliki akses eksklusif ke wilayahnya masing-masing untuk melakukan input transaksi harian, memantau *dashboard* pertumbuhan wilayah, dan melihat posisinya di *Leaderboard*.

---

## 💻 Panduan Menjalankan Secara Lokal (Development)
Untuk keperluan pengembangan (*development*) atau percobaan (*testing*) di komputer lokal, langkah pertama yang **wajib** dilakukan adalah mengunduh (*clone*) kode sumber *repository* ini ke komputer kamu:

```bash
git clone https://github.com/nanda_zahran/Sistem-Manajemen-Informasi-Tabung-Hijau.git
cd Sistem-Manajemen-Informasi-Tabung-Hijau
```

Setelah berhasil masuk ke dalam folder project, terdapat dua cara yang bisa digunakan untuk menjalankannya:

### Cara 1: Menggunakan Docker Sepenuhnya (Sangat Disarankan)
Cara ini paling mudah karena kamu tidak perlu menginstal Rust, Node.js, atau mengatur konfigurasi *database* secara manual.

1. **Persyaratan:** Pastikan Docker Desktop (atau Podman Desktop) sudah terinstal di komputer. *(Catatan: Jika menggunakan Podman, kamu cukup mengganti semua perintah `docker` di panduan ini menjadi `podman`)*.
2. **Konfigurasi `.env`:** Copy file `.env.example` yang sudah ada di **folder utama (root)** menjadi `.env` (di lokasi yang sama). Buka file tersebut dan ikuti arahan di dalamnya.
3. **Jalankan Project:** Buka terminal di folder utama (root) project ini, lalu jalankan:
   ```bash
   docker compose --profile dev up -d --build
   ```
   *(Catatan: Flag `--profile dev` akan menyalakan Frontend dengan mode Vite HMR untuk development lokal).*
4. **Akses Aplikasi:**
   - Frontend (UI): 👉 http://localhost:5173
   - Backend (API): 👉 http://localhost:3000
   - **Dokumentasi API (Swagger UI):** 👉 http://localhost:3000/swagger-ui
5. **Mematikan Server:** Jika sudah selesai, matikan semua *container* dengan mengetik perintah berikut (sertakan profil yang sedang menyala):
   ```bash
   docker compose --profile dev down
   ```
   *(Catatan: Perintah ini akan mematikan semua service secara otomatis tanpa menghapus data di database. Wajib menyertakan `--profile dev` agar UI lokal juga ikut dimatikan).*
   
   Jika kamu ingin melakukan *reset* total (mematikan server sekaligus **menghapus seluruh data database/volume**), gunakan *flag* `-v`:
   ```bash
   docker compose --profile dev down -v
   ```

### Cara 2: Menjalankan Secara Manual (Native Rust & Vite)
Gunakan cara ini jika kamu ingin aktif melakukan *coding* agar fitur *Hot Reload* dan pesan *error compiler* tampil lebih cepat di terminal.

1. **Persyaratan:** Pastikan kamu sudah menginstal toolchain Rust (rustup), Node.js, dan juga Docker/Podman (karena *database* tetap dijalankan di dalam *container*).
2. **Nyalakan Database:** Buka terminal di folder utama, dan hidupkan hanya *container database*:
   ```bash
   docker compose up -d db_sim_th
   ```
3. **Konfigurasi Backend:** 
   Buka file `.env` di **folder utama**. Pastikan URL database mengarah ke *port forwarding* lokal (5433):
   ```env
   DATABASE_URL=postgres://[USER]:[PASSWORD]@localhost:5433/[DB_NAME]
   ```
4. **Jalankan Backend (Rust):**
   Buka **tab terminal baru**, masuk ke folder backend, lalu jalankan server (migrasi tabel akan berjalan otomatis saat server dinyalakan):
   ```bash
   cd sim-th-backend
   cargo run
   ```
5. **Jalankan Frontend (Vite):**
   Buka *tab* terminal baru, masuk ke folder frontend, instal *dependencies*, dan nyalakan *server dev*:
   ```bash
   cd sim-th-frontend
   npm install
   npm run dev
   ```
6. **Akses Aplikasi:**
   - Frontend (UI): 👉 http://localhost:5173
   - Backend (API): 👉 http://localhost:3000
   - **Dokumentasi API (Swagger UI):** 👉 http://localhost:3000/swagger-ui

7. **Mematikan Server & Database:**
   Untuk mematikan aplikasi Frontend dan Backend, cukup tekan tombol `Ctrl + C` di masing-masing terminal yang sedang berjalan.
   Sedangkan untuk mematikan *container database* yang berjalan di latar belakang, buka terminal di folder utama (root) dan jalankan:
   ```bash
   docker compose down
   ```

---

## 🚀 Panduan Deployment (Production)
Sistem ini dirancang agar mudah di-*deploy* ke *server cloud* atau server mandiri (*Home Server* / VPS) dengan bantuan **Cloudflare Tunnel**. Penggunaan *tunnel* menghilangkan kebutuhan untuk mengatur *Port Forwarding* pada *router* dan mengamankan aplikasi dari akses luar yang tidak sah.

1. **Persiapan Server:**
   Pastikan server tujuan sudah terinstal **Docker (beserta Docker Compose)** atau **Podman (beserta podman Compose)**. Sama seperti langkah *development*, pertama-tama kamu wajib meng-*clone* *repository* ini di server tujuan:
   ```bash
   git clone https://github.com/nanda_zahran/Sistem-Manajemen-Informasi-Tabung-Hijau.git
   cd Sistem-Manajemen-Informasi-Tabung-Hijau
   ```

2. **Siapkan Environment Variables (.env) untuk Production:**
   Copy `.env.example` menjadi `.env`. **Penting:** Ubah konfigurasi URL API dan masukkan Token Cloudflare-nya:
   ```env
   # Ganti ke domain API publik kamu agar Frontend bisa memanggilnya
   VITE_API_URL=https://api.tabunghijau.com/api
   
   # Dapatkan dari Cloudflare Zero Trust (Networks -> Tunnels -> Create Tunnel)
   CLOUDFLARE_TOKEN=eyJh...
   ```

3. **Jalankan Profile Production:**
   Jalankan perintah berikut agar Backend, Frontend (Nginx siap rilis), Database, **dan Cloudflare Tunnel** menyala secara otomatis di latar belakang (*background*):
   ```bash
   docker compose --profile production up -d --build
   ```

4. **Konfigurasi Routing Cloudflare Zero Trust:**
   Karena Tunnel berjalan di dalam Docker, ia bisa memanggil *container* lain hanya dengan menggunakan nama *service*-nya. Pada menu *Public Hostname* di *dashboard* Cloudflare, atur perutean menjadi:
   - **Domain UI** (misal: `sim.tabunghijau.com`) -> Service Type: `HTTP` | URL: `frontend-prod:80`
   - **Domain API** (misal: `api.tabunghijau.com`) -> Service Type: `HTTP` | URL: `backend:3000`

5. **Selesai!** 
   Aplikasi Tabung Hijau sekarang sudah *live* dan bisa diakses dari internet dengan aman!

6. **Mematikan Server Production (Bila Diperlukan):**
   Jika sewaktu-waktu kamu perlu mematikan seluruh layanan di server, jalankan perintah ini agar *container* production dan *tunnel* ikut mati:
   ```bash
   docker compose --profile production down
   ```
