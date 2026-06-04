# 🌿 Sistem Manajemen Informasi Tabung Hijau (SIM-TH)

Sistem Informasi dan Manajemen Tabung Hijau (SIM-TH) adalah platform digital terpadu yang dirancang untuk mengelola, melacak, dan menganalisis data transaksi bank sampah dari berbagai BEM Wilayah di IPB. 

Platform ini memudahkan pencatatan setoran sampah, memantau saldo tabungan wilayah, hingga menampilkan *Leaderboard KPI* secara *real-time* untuk memicu semangat kompetisi yang sehat antar wilayah dalam menjaga lingkungan.

---

## 🎯 Fitur Utama
- **Manajemen Setoran Sampah:** Pencatatan berat dan kategori sampah secara transparan yang otomatis dikonversi menjadi nilai rupiah berdasarkan harga terbaru.
- **Sistem Tabungan Wilayah:** Saldo tabungan setiap wilayah akan otomatis terakumulasi dari setoran dan mendukung fitur penarikan/pencairan dana.
- **Leaderboard KPI (Key Performance Indicator):** Pemeringkatan wilayah secara *real-time* berdasarkan metrik rata-rata kualitas pemilahan, kuantitas sampah, dan nilai ekonomi.
- **Notifikasi & Broadcast:** Sistem pengumuman dan riwayat aktivitas interaktif antar BEM Wilayah dan Administrator.
- **Pemulihan Akun via OTP Email:** Mendukung reset password secara mandiri dan aman menggunakan verifikasi OTP 6 digit yang dikirimkan secara otomatis ke email pengguna (Auto OTP Email).

## 👥 Pengguna Sistem (Role)
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

1. **Persyaratan:** Pastikan Docker Desktop (atau Podman) sudah terinstal di komputer.
2. **Konfigurasi `.env`:** Copy file `.env.example` yang sudah ada di **folder utama (root)** menjadi `.env` (di lokasi yang sama). Buka file tersebut dan ikuti arahan di dalamnya.
3. **Jalankan Project:** Buka terminal di folder utama (root) project ini, lalu jalankan:
   ```bash
   docker compose --profile dev up -d --build
   ```
   *(Catatan: Flag `--profile dev` akan menyalakan Frontend dengan mode Vite HMR untuk development lokal).*
4. **Akses Aplikasi:**
   - Frontend (UI): 👉 http://localhost:5173
   - Backend (API): 👉 http://localhost:3000
5. **Mematikan Server:** Jika sudah selesai, bersihkan RAM dan proses dengan mengetik:
   ```bash
   docker compose down
   ```

### Cara 2: Menjalankan Secara Manual (Native Rust & Vite)
Gunakan cara ini jika kamu ingin aktif melakukan *coding* agar fitur *Hot Reload* dan pesan *error compiler* tampil lebih cepat di terminal.

1. **Persyaratan:** Pastikan kamu sudah menginstal toolchain Rust (rustup) dan Node.js.
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
   Masuk ke folder backend, lalu jalankan server (migrasi tabel akan berjalan otomatis saat server dinyalakan):
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

---

## 🚀 Panduan Deployment (Production)
Sistem ini dirancang agar mudah di-*deploy* ke *server cloud* atau server mandiri (*Home Server* / VPS) dengan bantuan **Cloudflare Tunnel**. Penggunaan *tunnel* menghilangkan kebutuhan untuk mengatur *Port Forwarding* pada *router* dan mengamankan aplikasi dari akses luar yang tidak sah.

1. **Siapkan Environment Variables:**
   Di *server*, pastikan kamu sudah membuat file `.env` di folder utama. Selain kredensial standar, tambahkan Token dari konfigurasi Tunnel di *dashboard* **Cloudflare Zero Trust**:
   ```env
   CLOUDFLARE_TOKEN=eyJh...
   ```

2. **Jalankan Profile Production:**
   Sistem memiliki "trik" *Docker Profile*. Jalankan perintah berikut agar Backend, Frontend, Database, **dan Tunnel** menyala bersamaan:
   ```bash
   docker compose --profile production up -d --build
   ```

3. **Konfigurasi Cloudflare Zero Trust:**
   Pada menu *Public Hostname* di *dashboard* Cloudflare, lakukan perutean trafik internet masuk menuju *network* Docker lokal:
   - Untuk UI (misal: `sim.tabunghijau.com`) -> arahkan ke URL `http://frontend-prod:80`
   - Untuk API (misal: `api.tabunghijau.com`) -> arahkan ke URL `http://backend:3000`

4. **Selesai!** 
   Aplikasi Tabung Hijau sekarang sudah *live* dan bisa diakses dari internet dengan aman!
