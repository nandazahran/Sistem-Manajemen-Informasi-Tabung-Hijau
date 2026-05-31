use axum::{
    extract::{Path, State, Json, Request, Query},
    http::{header, StatusCode, HeaderMap},
    middleware::Next,
    response::Response,
    extract::ws::{WebSocketUpgrade, WebSocket, Message as WsMessage},
};
use axum::Extension;
use sea_orm::{DatabaseConnection, ActiveModelTrait, EntityTrait, Set, QueryFilter, ColumnTrait, FromQueryResult, JoinType, QuerySelect, RelationTrait, ModelTrait, QueryOrder};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify, DEFAULT_COST}; // Tambahkan alat bcrypt
use jsonwebtoken::{encode, EncodingKey, Header, decode, DecodingKey, Validation}; // Alat pembuat JWT
use chrono::{Utc, Duration, Datelike, NaiveDateTime}; // Jam digital untuk masa berlaku token
use totp_rs::{Algorithm, Secret, TOTP};
use lettre::{Message, AsyncTransport, AsyncSmtpTransport, Tokio1Executor};
use lettre::message::header::ContentType;
use lettre::transport::smtp::authentication::Credentials;
use rand::RngExt;
use utoipa::ToSchema;

use crate::entities::{user, wilayah, kategori_sampah, transaksi_sampah, tabungan_sampah, kontak, rekening_wilayah};

// Struct khusus untuk menerima data Register
#[derive(Deserialize,ToSchema)]
pub struct InputRegister {
    pub username: String,
    pub password: String,
    pub email: String,
    pub nama: String,
    pub role: String, // Nanti diisi: "Admin", "BEMWilayah", atau "DUI"
    pub wilayah_id: Option<i32>, // Pakai Option karena Admin/DUI tidak punya wilayah
}

// Struct khusus untuk menerima data Login
#[derive(Deserialize,ToSchema)]
pub struct InputLogin {
    pub username: String,
    pub password: String,
}
#[derive(Deserialize,ToSchema)]
pub struct InputAktifkanTOTP {
    pub kode_totp: String,
}

// 2. Buat Input untuk Endpoint 2FA baru
#[derive(Deserialize,ToSchema)]
pub struct InputVerify2FA {
    pub username: String,
    pub pre_auth_token: String,
    pub kode_totp: String,
}

// 3. Buat Struct khusus untuk JWT Sementara (Pre-Auth)
#[derive(Debug, Serialize, Deserialize)]
pub struct KlaimPreAuth {
    pub sub: String,
    pub exp: usize,
    pub is_pre_auth: bool, // Penanda agar token ini tidak bisa dipakai untuk akses hal lain
}

#[derive(Serialize,ToSchema)]
pub struct ResponPesan {
    pub status: String,
    pub pesan: String,
}

// Struct untuk menerima data dari frontend
#[derive(Deserialize,ToSchema)]
pub struct InputWilayah {
    pub nama: String,
    pub status: String,
    pub nomor_rekening: Option<String>,
    pub nama_bank: Option<String>,
    pub atas_nama: Option<String>,
}

// Ini adalah isi dari KTP Digital-nya
#[derive(Serialize, Deserialize)]
pub struct KlaimToken {
    pub sub: String, // sub = subject (siapa pemilik KTP ini)
    pub exp: usize,  // exp = expiration (kapan KTP ini hangus)
}

// Balasan khusus untuk fitur Login
#[derive(Serialize,ToSchema)]
pub struct ResponLogin {
    pub status: String,
    pub pesan: String,
    pub token: Option<String>, // Option karena kalau gagal login, token-nya kosong (None)
}

// Struct Input
#[derive(Deserialize,ToSchema)]
pub struct InputLupaPassword {
    pub email: String, 
}

#[derive(Deserialize,ToSchema)]
pub struct InputResetPasswordEmail {
    pub email: String,
    pub otp: String,
    pub password_baru: String,
}

#[derive(Deserialize,ToSchema)]
pub struct InputUpdateUser {
    pub nama: String,
    pub status: String,
    pub telepon: Option<String>,
}

// Struct untuk Ubah Password dari Halaman Profil
#[derive(Deserialize,ToSchema)]
pub struct InputUbahPassword {
    pub password_lama: String,
    pub password_baru: String,
}

// Struct untuk menerima data dari frontend
#[derive(Deserialize,ToSchema)]
pub struct InputKategori {
    pub nama_kategori: String,
    pub harga_per_kg: i32, 
}

// Struct untuk menerima input (Perhatikan kita pakai berat_gram)
#[derive(Deserialize,ToSchema)]
pub struct InputTransaksi {
    pub kategori_id: i32,
    pub berat_gram: i32, 
    pub poin_kualitas: i32, // Tangkap skor 30, 25, 15, dll dari Frontend
    pub catatan: Option<String>,
    pub tanggal: Option<String>, // Tambahan field Tanggal
}

// Struct untuk menerima request penarikan saldo
#[derive(Deserialize,ToSchema)]
pub struct InputTarik {
    pub wilayah_id: i32,
    pub nominal: i32,
}

// Cetakan untuk data Transaksi yang sudah digabung
#[derive(FromQueryResult, Serialize,ToSchema)]
pub struct TransaksiLengkap {
    pub id: i32,
    pub berat: i32,
    pub total_nilai: i32,
    pub status: String,
    pub nama_kategori: String, // Diambil dari tabel kategori
    pub nama_wilayah: String,  // Diambil dari tabel wilayah
    pub poin_kualitas: i32,    // Tambahan kolom skor
    pub nama_petugas: String,  // Diambil dari tabel user
    pub catatan: Option<String>, // Tambahan kolom catatan
    #[schema(value_type = String)]
    pub tanggal: NaiveDateTime, 
}

// Ganti tipe data i32 menjadi Option<i64> dan i64
#[derive(FromQueryResult, Serialize,ToSchema)]
pub struct RekapDashboard {
    pub total_berat_gram: Option<i64>, // Pakai Option karena SUM bisa NULL kalau tabel kosong
    pub total_rupiah: Option<i64>,     // Postgres mengembalikan INT8 (i64) untuk SUM
    pub jumlah_transaksi: i64,         // Postgres mengembalikan INT8 (i64) untuk COUNT
}

// Cetakan untuk data Tabungan yang sudah digabung
#[derive(FromQueryResult, Serialize,ToSchema)]
pub struct TabunganLengkap {
    pub id: i32,
    pub saldo: i32,
    pub status: String,
    pub nama_wilayah: String, // Diambil dari tabel wilayah
}

#[derive(Deserialize, ToSchema)]
pub struct InputKontak {
    pub nama: String,
    pub email: String,
    pub pesan: String,
}

#[derive(Serialize, ToSchema)]
pub struct LeaderboardItem {
    pub peringkat: usize,
    pub nama_wilayah: String,
    pub poin_kpi: i64,
    pub total_berat_gram: i64,
    pub total_rupiah: i64,
}

#[derive(FromQueryResult, Serialize)]
pub struct TransaksiKategoriBiasa {
    pub id: i32,
    pub berat: i32,
    pub total_nilai: i32,
    pub nama_kategori: String,
    pub tanggal: NaiveDateTime, // Tambahan kolom tanggal
}

// Struct untuk Filter Periode Tanggal
#[derive(Deserialize, ToSchema)]
pub struct FilterLeaderboard {
    pub tanggal_mulai: Option<String>,
    pub tanggal_akhir: Option<String>,
}

// Struct untuk Filter Export Transaksi
#[derive(Deserialize, ToSchema)]
pub struct FilterExport {
    pub tanggal_mulai: Option<String>,
    pub tanggal_akhir: Option<String>,
    pub wilayah_id: Option<i32>, // Admin/DUI bisa export spesifik 1 wilayah
}

// Struct untuk Input Broadcast dari Dashboard DUI
#[derive(Deserialize, ToSchema)]
pub struct InputBroadcastNotifikasi {
    pub judul: String,
    pub pesan: String,
    pub target: Option<String>,
}

// Fungsi pembantu untuk memetakan role dari form register ke nama wilayah di database
pub fn role_to_wilayah_name(role: &str) -> Option<String> {
    match role {
        "bem_faperta" => Some("BEM FAPERTA".to_string()),
        "bem_skhb" => Some("BEM SKHB".to_string()),
        "bem_fpik" => Some("BEM FPIK".to_string()),
        "bem_fapet" => Some("BEM FAPET".to_string()),
        "bem_fahutan" => Some("BEM FAHUTAN".to_string()),
        "bem_fateta" => Some("BEM FATETA".to_string()),
        "bem_fmipa" => Some("BEM FMIPA".to_string()),
        "bem_fem" => Some("BEM FEM".to_string()),
        "bem_fema" => Some("BEM FEMA".to_string()),
        "bem_vokasi" => Some("BEM VOKASI".to_string()),
        "bem_sb" => Some("BEM SB".to_string()),
        "bem_fk" => Some("BEM FK".to_string()),
        "bem_ssmi" => Some("BEM SSMI".to_string()),
        "ormawa_ppku" => Some("Ormawa Eksekutif PPKU".to_string()), // Disesuaikan dengan frontend
        // admin, dui, bem_km tidak terikat 1 wilayah khusus (Null)
        "bem_km" | "admin" | "dui" => None,
        _ => None,
    }
}

// Fungsi Register yang sudah di-upgrade
#[utoipa::path(
    post,
    path = "/api/register",
    request_body = InputRegister,
    responses(
        (status = 201, description = "Berhasil mendaftarkan akun baru", body = ResponPesan),
        (status = 409, description = "Gagal mendaftar: Email atau Username sudah dipakai (Konflik Data)", body = ResponPesan),
        (status = 500, description = "Sistem bermasalah saat melakukan hashing password", body = ResponPesan)
    ),
    tag = "Auth"
)]
pub async fn register(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputRegister>,
) -> (StatusCode, Json<ResponPesan>) {
    
    // 1. LOGIKA BARU: Tentukan wilayah_id secara otomatis di backend
    let wilayah_id_otomatis: Option<i32> = if let Some(nama_wilayah) = role_to_wilayah_name(&payload.role) {
        // Jika role-nya adalah BEM Wilayah, cari ID wilayah berdasarkan namanya
        match wilayah::Entity::find().filter(wilayah::Column::Nama.eq(nama_wilayah.clone())).one(&db).await {
            Ok(Some(w)) => Some(w.id),
            _ => {
                // Jika wilayah belum dibuat di Pengaturan Data, kirim error
                return (
                    StatusCode::BAD_REQUEST,
                    Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: format!("Wilayah '{}' belum terdaftar di sistem. Silakan buat melalui menu Pengaturan Data oleh Admin.", nama_wilayah),
                    })
                );
            }
        }
    } else {
        // Jika role-nya admin (bem_km, dui), wilayah_id-nya null
        None
    };

    // 2. PROSES HASHING PASSWORD
    let password_acak = match hash(&payload.password, DEFAULT_COST) {
        Ok(hasil_hash) => hasil_hash,
        Err(_) => return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ResponPesan {
                status: "error".to_string(),
                pesan: "Sistem bermasalah saat mengamankan password.".to_string(),
            })
        ),
    };

    // 3. SIAPKAN MODEL DATA
    let user_baru = user::ActiveModel {
        username: Set(payload.username.clone()),
        email: Set(payload.email.clone()),
        password: Set(password_acak),
        nama: Set(payload.nama.clone()),
        role: Set(payload.role.clone()),
        status: Set("Aktif".to_string()),
        wilayah_id: Set(wilayah_id_otomatis), // Gunakan ID yang ditemukan otomatis
        ..Default::default()
    };

    // 4. SIMPAN KE DATABASE
    match user_baru.insert(&db).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ResponPesan {
                status: "sukses".to_string(),
                pesan: format!("Beres! Akun '{}' berhasil didaftarkan sebagai {}.", payload.username, payload.role),
            })
        ),
        Err(_) => (
            StatusCode::CONFLICT,
            Json(ResponPesan {
                status: "gagal".to_string(),
                pesan: format!("Gagal mendaftar: Email atau Username mungkin sudah dipakai."),
            })
        ),
    }
}

// Fungsi Lihat Semua User (READ)
#[utoipa::path(
    get,
    path = "/api/users",
    responses(
        (status = 200, description = "Berhasil mengambil daftar semua user (Password disembunyikan)", body = serde_json::Value),
        (status = 401, description = "Akses ditolak: Kamu tidak membawa Token JWT yang valid", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada sistem/database", body = serde_json::Value)
    ),
    tag = "Manajemen User",
    security(
        ("jwt_auth" = []) // <-- Jangan lupa, ini butuh ID (Token) untuk masuk
    )
)]
pub async fn lihat_user(
    State(db): State<DatabaseConnection>,
) -> (StatusCode, Json<serde_json::Value>) { // <-- Tipe kembalian ditingkatkan dengan StatusCode
    let pencarian = user::Entity::find().all(&db).await;

    match pencarian {
        Ok(daftar_user) => {
            // Kita saring datanya agar kolom 'password' TIDAK ikut terkirim ke frontend!
            let data_aman: Vec<_> = daftar_user.into_iter().map(|u| {
                serde_json::json!({
                    "id": u.id,
                    "username": u.username,
                    "nama": u.nama,
                    "role": u.role,
                    "telepon": u.telepon
                })
            }).collect();

            (
                StatusCode::OK, // 200: Sukses mengambil data
                Json(serde_json::json!({
                    "status": "sukses",
                    "data": data_aman
                }))
            )
        },
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR, // 500: Server error
            Json(serde_json::json!({
                "status": "error",
                "pesan": format!("Gagal mengambil data user: {}", e)
            }))
        ),
    }
}

// Fungsi Update User (Ganti Nama & Status)
#[utoipa::path(
    put,
    path = "/api/users/{id}", // {id} ini mewakili angka ID user di URL
    request_body = InputUpdateUser,
    params(
        ("id" = i32, Path, description = "ID User yang ingin diupdate")
    ),
    responses(
        (status = 200, description = "Data user berhasil diupdate", body = ResponPesan),
        (status = 400, description = "Format data input tidak valid", body = ResponPesan),
        (status = 401, description = "Akses ditolak: Token JWT tidak ada atau kadaluarsa", body = ResponPesan),
        (status = 404, description = "Gagal: User dengan ID tersebut tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada server/database", body = ResponPesan)
    ),
    tag = "Manajemen User",
    security(
        ("jwt_auth" = []) // Rute privat, wajib ada JWT
    )
)]
pub async fn update_user(
    State(db): State<DatabaseConnection>,
    Path(user_id): Path<i32>,
    Json(payload): Json<InputUpdateUser>,
) -> (StatusCode, Json<ResponPesan>) { // <-- Tipe kembalian ditingkatkan

    let pencarian = user::Entity::find_by_id(user_id).one(&db).await;

    match pencarian {
        Ok(Some(data_lama)) => {
            let mut data_aktif: user::ActiveModel = data_lama.into();
            
            // Update nama dan status
            data_aktif.nama = Set(payload.nama.clone()); 
            data_aktif.status = Set(payload.status.clone()); 
            data_aktif.telepon = Set(payload.telepon.clone()); 

            match data_aktif.update(&db).await {
                Ok(_) => (
                    StatusCode::OK, // 200: Update sukses
                    Json(ResponPesan {
                        status: "sukses".to_string(),
                        pesan: format!(
                            "Data admin ID {} berhasil diupdate. Nama: '{}', Status: '{}'.", 
                            user_id, payload.nama, payload.status
                        ),
                    })
                ),
                Err(e) => (
                    StatusCode::INTERNAL_SERVER_ERROR, // 500: Database gagal nge-save
                    Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: format!("Gagal mengupdate user: {}", e),
                    })
                )
            }
        },
        Ok(None) => (
            StatusCode::NOT_FOUND, // 404: ID User tidak ada di database
            Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string() })
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR, // 500: Error saat nyari data
            Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() })
        ),
    }
}

// Fungsi Hapus User (DELETE)
#[utoipa::path(
    delete,
    path = "/api/users/{id}",
    params(
        ("id" = i32, Path, description = "ID User yang ingin dihapus/dicabut aksesnya")
    ),
    responses(
        (status = 200, description = "Akses user berhasil dicabut (dihapus)", body = ResponPesan),
        (status = 401, description = "Akses ditolak: Token JWT tidak ada atau kadaluarsa", body = ResponPesan),
        (status = 404, description = "Gagal: User tidak ditemukan", body = ResponPesan),
        (status = 409, description = "Konflik Data: User tidak bisa dihapus karena sudah memiliki jejak audit/transaksi", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada sistem/database", body = ResponPesan)
    ),
    tag = "Manajemen User",
    security(
        ("jwt_auth" = []) // Rute privat
    )
)]
pub async fn hapus_user(
    State(db): State<DatabaseConnection>,
    Path(user_id): Path<i32>,
) -> (StatusCode, Json<ResponPesan>) { // <-- Tipe kembalian ditingkatkan
    let pencarian = user::Entity::find_by_id(user_id).one(&db).await;

    match pencarian {
        Ok(Some(data)) => {
            let username_dihapus = data.username.clone();
            match data.delete(&db).await {
                Ok(_) => (
                    StatusCode::OK, // 200: Sukses hapus
                    Json(ResponPesan {
                        status: "sukses".to_string(),
                        pesan: format!("Akses admin untuk '{}' berhasil dicabut (dihapus).", username_dihapus),
                    })
                ),
                Err(_) => (
                    StatusCode::CONFLICT, // 409: Bentrok dengan data transaksi (Foreign Key)
                    Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: "Gagal! User ini tidak bisa dihapus karena sudah pernah mencatat transaksi. Aksesnya harus dibiarkan untuk jejak audit.".to_string(),
                    })
                )
            }
        },
        Ok(None) => (
            StatusCode::NOT_FOUND, // 404: User tidak ada
            Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string() })
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR, // 500: Database error
            Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() })
        ),
    }
}

// Fungsi Login yang sudah di-upgrade
#[utoipa::path(
    post,
    path = "/api/login",
    request_body = InputLogin,
    responses(
        (status = 200, description = "Login sukses (mendapat token JWT) atau Butuh Verifikasi OTP", body = ResponLogin),
        (status = 401, description = "Gagal login: Password salah", body = ResponLogin),
        (status = 403, description = "Gagal login: Akun dalam status Nonaktif", body = ResponLogin),
        (status = 404, description = "Gagal login: Username tidak ditemukan", body = ResponLogin)
    ),
    tag = "Auth"
)]
pub async fn login(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputLogin>, 
) -> (StatusCode, Json<ResponLogin>) { // <-- Tipe kembalian diubah untuk menyertakan StatusCode

    let pencarian_user = user::Entity::find().filter(user::Column::Username.eq(payload.username.clone())).one(&db).await;

    match pencarian_user {
        Ok(Some(data_user)) => {
            if data_user.status != "Aktif" {
                return (
                    StatusCode::FORBIDDEN, // 403: Dilarang masuk
                    Json(ResponLogin { status: "gagal".to_string(), pesan: "Akun nonaktif.".to_string(), token: None })
                );
            }

            let password_cocok = verify(&payload.password, &data_user.password).unwrap_or(false);

            if password_cocok {
                let kunci_rahasia = std::env::var("JWT_SECRET").expect("JWT_SECRET belum diatur").into_bytes();

                // JIKA 2FA AKTIF: Berikan Token Pre-Auth
                if data_user.totp_aktif {
                    let waktu_hangus_pre = Utc::now().checked_add_signed(Duration::minutes(5)).unwrap().timestamp() as usize;
                    let klaim_pre = KlaimPreAuth {
                        sub: data_user.username.clone(),
                        exp: waktu_hangus_pre,
                        is_pre_auth: true,
                    };
                    
                    let token_sementara = encode(&Header::default(), &klaim_pre, &EncodingKey::from_secret(&kunci_rahasia)).unwrap();

                    return (
                        StatusCode::OK, // 200: Sukses tahap 1
                        Json(ResponLogin {
                            status: "butuh_otp".to_string(),
                            pesan: "Silakan masukkan 6 digit kode dari Authenticator Anda.".to_string(),
                            token: Some(token_sementara),
                        })
                    );
                }

                // JIKA 2FA TIDAK AKTIF: Langsung berikan Token Akses Asli
                let waktu_hangus = Utc::now().checked_add_signed(Duration::hours(24)).unwrap().timestamp() as usize;
                let klaim = KlaimToken {
                    sub: data_user.username.clone(),
                    exp: waktu_hangus,
                };

                let token_jwt = encode(&Header::default(), &klaim, &EncodingKey::from_secret(&kunci_rahasia)).unwrap();

                (
                    StatusCode::OK, // 200: Sukses login penuh
                    Json(ResponLogin {
                        status: "sukses".to_string(),
                        pesan: format!("Selamat datang, {}!", data_user.nama),
                        token: Some(token_jwt),
                    })
                )
            } else {
                (
                    StatusCode::UNAUTHORIZED, // 401: Password salah
                    Json(ResponLogin { status: "gagal".to_string(), pesan: "Password salah.".to_string(), token: None })
                )
            }
        },
        _ => (
            StatusCode::NOT_FOUND, // 404: Username tidak ada
            Json(ResponLogin { status: "gagal".to_string(), pesan: "Akun tidak ditemukan.".to_string(), token: None })
        )
    }
}

#[utoipa::path(
    post,
    path = "/api/verify-2fa",
    request_body = InputVerify2FA,
    responses(
        (status = 200, description = "Verifikasi berhasil, mendapatkan Token Akses JWT (24 Jam)", body = ResponLogin),
        (status = 401, description = "Akses ditolak: Token sementara kadaluarsa, tidak valid, atau kode OTP salah", body = ResponLogin),
        (status = 404, description = "Gagal: User yang bersangkutan tidak ditemukan", body = ResponLogin)
    ),
    tag = "Auth"
)]
pub async fn verify_2fa(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputVerify2FA>,
) -> (StatusCode, Json<ResponLogin>) { // <-- Tipe kembalian diubah
    
    let kunci_rahasia = std::env::var("JWT_SECRET").expect("JWT_SECRET belum diatur").into_bytes();

    // 1. Bongkar dan Validasi Token Sementara
    let token_data = match decode::<KlaimPreAuth>(
        &payload.pre_auth_token,
        &DecodingKey::from_secret(&kunci_rahasia),
        &Validation::default(),
    ) {
        Ok(data) => data,
        Err(_) => return (
            StatusCode::UNAUTHORIZED, // 401: Token kadaluarsa
            Json(ResponLogin { status: "gagal".to_string(), pesan: "Sesi login kadaluarsa (lewat 5 menit). Silakan login ulang.".to_string(), token: None })
        ),
    };

    // Pastikan ini memang token pre-auth, bukan token akses bodong
    if !token_data.claims.is_pre_auth {
        return (
            StatusCode::UNAUTHORIZED, // 401: Token salah jenis
            Json(ResponLogin { status: "gagal".to_string(), pesan: "Token tidak valid.".to_string(), token: None })
        );
    }

    // 2. Cari User
    let username = token_data.claims.sub;
    let pencarian_user = user::Entity::find().filter(user::Column::Username.eq(username)).one(&db).await;

    match pencarian_user {
        Ok(Some(data_user)) => {
            // 3. Verifikasi 6 Digit OTP
            let secret_base32 = data_user.totp_secret.clone().unwrap();
            let secret_bytes = Secret::Encoded(secret_base32).to_bytes().unwrap();
            let totp = TOTP::new(
                Algorithm::SHA1, 
                6, 
                1, 
                30, 
                secret_bytes, 
                Some("Tabung Hijau IPB".to_string()), 
                payload.username.clone()
            ).unwrap();

            if !totp.check_current(&payload.kode_totp).unwrap_or(false) {
                return (
                    StatusCode::UNAUTHORIZED, // 401: Kode OTP salah
                    Json(ResponLogin { status: "gagal".to_string(), pesan: "Kode OTP salah!".to_string(), token: None })
                );
            }

            // 4. Lolos Semua! Berikan Token Akses Asli (24 Jam)
            let waktu_hangus = Utc::now().checked_add_signed(Duration::hours(24)).unwrap().timestamp() as usize;
            let klaim = KlaimToken {
                sub: data_user.username.clone(),
                exp: waktu_hangus,
            };

            let token_jwt = encode(&Header::default(), &klaim, &EncodingKey::from_secret(&kunci_rahasia)).unwrap();

            (
                StatusCode::OK, // 200: Semuanya sukses!
                Json(ResponLogin {
                    status: "sukses".to_string(),
                    pesan: "Autentikasi 2FA Berhasil!".to_string(),
                    token: Some(token_jwt),
                })
            )
        },
        _ => (
            StatusCode::NOT_FOUND, // 404: Data user tidak ada
            Json(ResponLogin { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string(), token: None })
        )
    }
}

// Fungsi Token Penjaga Pintu (Middleware)
pub async fn token_jwt(
    mut req: Request, // Tangkap request yang masuk
    next: Next,       // Lanjutkan ke handler utama
) -> Result<Response, (StatusCode, Json<ResponPesan>)> {
    
    // Cek apakah request menyertakan ID (Token) di Header Authorization
    let header_auth = req.headers().get(header::AUTHORIZATION).and_then(|h| h.to_str().ok());

    let token_lengkap = match header_auth {
        Some(isi_header) => isi_header,
        None => return Err((
            StatusCode::UNAUTHORIZED, // Kode 401: Tidak punya izin
            Json(ResponPesan { 
                status: "gagal".to_string(), 
                pesan: "Akses ditolak! Anda tidak membawa Token JWT.".to_string() 
            })
        )),
    };

    // Sesuai standar API, token harus diawali dengan kata "Bearer "
    if !token_lengkap.starts_with("Bearer ") {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ResponPesan { 
                status: "gagal".to_string(), 
                pesan: "Format token salah! Harus diawali dengan 'Bearer '.".to_string() 
            })
        ));
    }

    // Potong 7 huruf pertama ("Bearer ") untuk mengambil token aslinya saja
    let token_asli = &token_lengkap[7..];
    
    // Harus sama persis dengan kunci saat login
    let kunci_rahasia = std::env::var("JWT_SECRET")
        .expect("JWT_SECRET belum diatur di file .env!")
        .into_bytes();

    // Verifikasi keaslian Token menggunakan kunci rahasia
    match decode::<KlaimToken>(
        token_asli,
        &DecodingKey::from_secret(&kunci_rahasia),
        &Validation::default(),
    ) {
        Ok(data_token) => {
            // Ambil 'sub' (username) dari Token, dan masukkan ke dalam Ekstensi Axum
            req.extensions_mut().insert(data_token.claims.sub);
            
            // Token valid, lanjutkan eksekusi ke endpoint tujuan
            Ok(next.run(req).await)
        }
        Err(_) => {
            // Jika token palsu, dimanipulasi, atau sudah kadaluarsa
            Err((
                StatusCode::UNAUTHORIZED,
                Json(ResponPesan { 
                    status: "gagal".to_string(), 
                    pesan: "Token JWT tidak valid atau sudah kadaluarsa! Silakan login ulang.".to_string() 
                })
            ))
        }
    }
}

#[utoipa::path(
    post,
    path = "/api/users/setup-totp",
    responses(
        (status = 200, description = "Berhasil membuat Secret Key dan URL QR Code untuk TOTP", body = serde_json::Value),
        (status = 401, description = "Akses ditolak: Kamu tidak membawa Token JWT yang valid", body = ResponPesan),
        (status = 404, description = "Gagal: User dari token tersebut tidak ditemukan di database", body = serde_json::Value)
    ),
    tag = "Manajemen User",
    security(
        ("jwt_auth" = []) // <-- INI PENTING! Penanda rute ini butuh Token JWT
    )
)]
pub async fn setup_totp(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>, 
) -> Json<serde_json::Value> {
    
    // Langsung pakai username_jwt dari Extension! Sangat bersih!
    let pencarian = user::Entity::find()
        .filter(user::Column::Username.eq(username_jwt.clone()))
        .one(&db)
        .await;

    match pencarian {
        Ok(Some(data_user)) => {
            let secret = Secret::generate_secret();
            let secret_bytes = secret.to_bytes().unwrap();
            
            let totp = TOTP::new(
                Algorithm::SHA1,
                6, 
                1, 
                30, 
                secret_bytes,
                Some("Tabung Hijau IPB".to_string()),
                username_jwt.clone(),                 
            ).unwrap();

            let secret_base32 = totp.get_secret_base32();
            let url_otpauth = totp.get_url(); 

            let mut data_aktif: user::ActiveModel = data_user.into();
            data_aktif.totp_secret = Set(Some(secret_base32.clone()));
            
            // PENTING: Status aktif kita set FALSE. 
            // Nanti diubah jadi TRUE oleh fungsi 'aktifkan_totp'
            data_aktif.totp_aktif = Set(false); 
            
            let _ = data_aktif.update(&db).await;

            Json(serde_json::json!({
                "status": "sukses",
                "pesan": "Berhasil membuat secret TOTP. Silakan masukkan kunci ini ke aplikasi Authenticator Anda, lalu verifikasi di menu Aktifkan TOTP.",
                "secret_key": secret_base32,
                "url_qr_code": url_otpauth
            }))
        },
        _ => Json(serde_json::json!({ "status": "gagal", "pesan": "User tidak ditemukan" })),
    }
}

#[utoipa::path(
    post,
    path = "/api/users/aktifkan-totp",
    request_body = InputAktifkanTOTP,
    responses(
        (status = 200, description = "Verifikasi sukses! Gembok 2FA resmi diaktifkan untuk akun ini", body = ResponPesan),
        (status = 400, description = "Gagal: User belum melakukan Setup TOTP (belum punya secret key)", body = ResponPesan),
        (status = 401, description = "Gagal: Kode OTP dari aplikasi Authenticator salah", body = ResponPesan),
        (status = 404, description = "Gagal: Data user dari token tidak ditemukan", body = ResponPesan)
    ),
    tag = "Manajemen User",
    security(
        ("jwt_auth" = []) // <-- Penanda rute privat
    )
)]
pub async fn aktifkan_totp(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>, 
    Json(payload): Json<InputAktifkanTOTP>,
) -> (StatusCode, Json<ResponPesan>) { // <-- Tipe kembalian diubah

    // Cari user yang sedang login
    let pencarian_user = user::Entity::find()
        .filter(user::Column::Username.eq(username_jwt.clone()))
        .one(&db)
        .await;

    match pencarian_user {
        Ok(Some(data_user)) => {
            // Cek apakah user sudah punya secret key (sudah klik setup sebelumnya)
            if let Some(secret_base32) = &data_user.totp_secret {
                
                let secret_bytes = Secret::Encoded(secret_base32.clone()).to_bytes().unwrap();
                let totp = TOTP::new(
                    Algorithm::SHA1, 
                    6, 
                    1, 
                    30, 
                    secret_bytes, 
                    Some("Tabung Hijau IPB".to_string()),
                    username_jwt.clone(),  
                ).unwrap();

                // Verifikasi 6 digit angka dari HP
                if totp.check_current(&payload.kode_totp).unwrap_or(false) {
                    
                    // Kalau benar, BARU kita ubah statusnya jadi AKTIF!
                    let mut data_aktif: user::ActiveModel = data_user.into();
                    data_aktif.totp_aktif = Set(true);
                    let _ = data_aktif.update(&db).await;

                    (
                        StatusCode::OK, // 200: Sukses mengaktifkan
                        Json(ResponPesan {
                            status: "sukses".to_string(),
                            pesan: "Autentikasi 2FA berhasil diaktifkan!".to_string(),
                        })
                    )
                } else {
                    (
                        StatusCode::UNAUTHORIZED, // 401: OTP salah
                        Json(ResponPesan {
                            status: "gagal".to_string(),
                            pesan: "Kode Authenticator salah! Gagal mengaktifkan 2FA.".to_string(),
                        })
                    )
                }
            } else {
                (
                    StatusCode::BAD_REQUEST, // 400: Belum setup
                    Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: "Anda belum melakukan Setup TOTP (belum minta kunci rahasia).".to_string(),
                    })
                )
            }
        },
        _ => (
            StatusCode::NOT_FOUND, // 404: User tidak valid
            Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak valid.".to_string() })
        )
    }
}
// Fungsi Tambah Wilayah
#[utoipa::path(
    post,
    path = "/api/wilayah",
    request_body = InputWilayah,
    responses(
        (status = 200, description = "Wilayah berhasil ditambahkan", body = ResponPesan),
        (status = 500, description = "Gagal menambahkan wilayah", body = ResponPesan)
    ),
    tag = "Wilayah",
    security(("jwt_auth" = []))
)]
pub async fn tambah_wilayah(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputWilayah>,
) -> Json<ResponPesan> {
    
    let wilayah_baru = wilayah::ActiveModel {
        nama: Set(payload.nama.clone()),
        status: Set(payload.status),
        ..Default::default()
    };

    match wilayah_baru.insert(&db).await {
        Ok(w) => {
            // Jika ada data rekening yang dikirim, masukkan ke tabel rekening_wilayah
            if let (Some(rek), Some(bank), Some(nama)) = (payload.nomor_rekening.clone(), payload.nama_bank.clone(), payload.atas_nama.clone()) {
                let rekening_baru = rekening_wilayah::ActiveModel {
                    wilayah_id: Set(w.id),
                    no_rekening: Set(rek),
                    nama_bank: Set(bank),
                    atas_nama: Set(nama),
                    is_utama: Set(true), // Berikan default "Utama" 
                    ..Default::default()
                };
                let _ = rekening_baru.insert(&db).await;
            }
            
            Json(ResponPesan {
                status: "sukses".to_string(),
                pesan: format!("Wilayah '{}' berhasil ditambahkan ke sistem.", payload.nama),
            })
        },
        Err(_) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Gagal menambahkan wilayah. Nama wilayah mungkin sudah ada.".to_string(),
        }),
    }
}

// Fungsi Lihat Semua Wilayah
#[utoipa::path(
    get,
    path = "/api/wilayah",
    responses(
        (status = 200, description = "Berhasil mengambil data wilayah sesuai hak akses", body = serde_json::Value),
        (status = 401, description = "Akses ditolak: Token tidak valid", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada database", body = ResponPesan)
    ),
    tag = "Wilayah",
    security(("jwt_auth" = []))
)]
pub async fn lihat_wilayah(
    State(db): State<DatabaseConnection>,
    // Extension ini berisi data dari Token JWT yang sudah dibongkar Satpam
    Extension(role_user): Extension<String>, 
    Extension(id_wilayah_user): Extension<Option<i32>>,
) -> (StatusCode, Json<serde_json::Value>) {
    
    // LOGIKA FILTER:
    // 1. Jika bem_km -> Ambil semua baris di tabel wilayah
    // 2. Jika bukan -> Ambil yang ID-nya cocok dengan wilayah si user
    
    let query = if role_user == "bem_km" || role_user == "admin" || role_user == "dui" {
        wilayah::Entity::find()
    } else {
        wilayah::Entity::find().filter(wilayah::Column::Id.eq(id_wilayah_user))
    };

    match query.all(&db).await {
        Ok(data) => {
            // GABUNGKAN WILAYAH DENGAN DATA REKENINGNYA
            let mut hasil_gabungan = Vec::new();
            for w in data {
                let rek = rekening_wilayah::Entity::find()
                    .filter(rekening_wilayah::Column::WilayahId.eq(w.id))
                    .filter(rekening_wilayah::Column::IsUtama.eq(true))
                    .one(&db)
                    .await
                    .unwrap_or(None);
                
                hasil_gabungan.push(serde_json::json!({
                    "id": w.id,
                    "nama": w.nama,
                    "status": w.status,
                    "nomor_rekening": rek.as_ref().map(|r| r.no_rekening.clone()),
                    "nama_bank": rek.as_ref().map(|r| r.nama_bank.clone()),
                    "atas_nama": rek.as_ref().map(|r| r.atas_nama.clone()),
                }));
            }

            (
                StatusCode::OK,
                Json(serde_json::json!({
                    "status": "sukses",
                    "role_pengakses": role_user,
                    "data": hasil_gabungan
                }))
            )
        },
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(serde_json::json!({
                "status": "error",
                "pesan": format!("Gagal mengambil data wilayah: {}", e)
            }))
        ),
    }
}

// Fungsi Update Wilayah (PUT)
#[utoipa::path(
    put,
    path = "/api/wilayah/{id}",
    request_body = InputWilayah,
    params(
        ("id" = i32, Path, description = "ID Wilayah yang ingin diupdate")
    ),
    responses(
        (status = 200, description = "Data wilayah berhasil diupdate", body = ResponPesan),
        (status = 404, description = "Wilayah tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada server/database", body = ResponPesan)
    ),
    tag = "Wilayah",
    security(("jwt_auth" = []))
)]
pub async fn update_wilayah(
    State(db): State<DatabaseConnection>,
    Path(wilayah_id): Path<i32>,
    Json(payload): Json<InputWilayah>,
) -> Json<ResponPesan> {
    let pencarian = wilayah::Entity::find_by_id(wilayah_id).one(&db).await;

    match pencarian {
        Ok(Some(data_lama)) => {
            let mut data_aktif: wilayah::ActiveModel = data_lama.into();
            data_aktif.nama = Set(payload.nama.clone());
            data_aktif.status = Set(payload.status.clone());

            match data_aktif.update(&db).await {
                    Ok(_) => {
                        // Update atau Insert data rekening wilayah
                        if let (Some(rek), Some(bank), Some(nama)) = (payload.nomor_rekening.clone(), payload.nama_bank.clone(), payload.atas_nama.clone()) {
                            let cek_rekening = rekening_wilayah::Entity::find()
                                .filter(rekening_wilayah::Column::WilayahId.eq(wilayah_id))
                                .filter(rekening_wilayah::Column::IsUtama.eq(true))
                                .one(&db)
                                .await
                                .unwrap_or(None);

                            if let Some(rek_lama) = cek_rekening {
                                let mut rek_aktif: rekening_wilayah::ActiveModel = rek_lama.into();
                                rek_aktif.no_rekening = Set(rek);
                                rek_aktif.nama_bank = Set(bank);
                                rek_aktif.atas_nama = Set(nama);
                                let _ = rek_aktif.update(&db).await;
                            } else {
                                let rekening_baru = rekening_wilayah::ActiveModel {
                                    wilayah_id: Set(wilayah_id),
                                    no_rekening: Set(rek),
                                    nama_bank: Set(bank),
                                    atas_nama: Set(nama),
                                    is_utama: Set(true),
                                    ..Default::default()
                                };
                                let _ = rekening_baru.insert(&db).await;
                            }
                        }

                        Json(ResponPesan {
                            status: "sukses".to_string(),
                            pesan: format!("Wilayah ID {} berhasil diupdate. Nama: '{}', Status: '{}'.", wilayah_id, payload.nama, payload.status),
                        })
                    },
                Err(e) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Gagal mengupdate wilayah: {}", e),
                })
            }
        },
        Ok(None) => Json(ResponPesan { status: "gagal".to_string(), pesan: "Wilayah tidak ditemukan.".to_string() }),
        Err(e) => Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
    }
}

// 2. Fungsi Hapus Wilayah (DELETE)
#[utoipa::path(
    delete,
    path = "/api/wilayah/{id}",
    params(
        ("id" = i32, Path, description = "ID Wilayah yang ingin dihapus")
    ),
    responses(
        (status = 200, description = "Wilayah berhasil dihapus", body = ResponPesan),
        (status = 404, description = "Wilayah tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan pada server/database", body = ResponPesan)
    ),
    tag = "Wilayah",
    security(("jwt_auth" = []))
)]
pub async fn hapus_wilayah(
    State(db): State<DatabaseConnection>,
    Path(wilayah_id): Path<i32>,
) -> Json<ResponPesan> {
    let pencarian = wilayah::Entity::find_by_id(wilayah_id).one(&db).await;

    match pencarian {
        Ok(Some(data)) => {
            match data.delete(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Wilayah ID {} berhasil dihapus dari sistem.", wilayah_id),
                }),
                Err(_) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: "Gagal menghapus! Wilayah ini tidak bisa dihapus karena sudah memiliki riwayat tabungan atau transaksi. Ubah statusnya menjadi 'Nonaktif' saja.".to_string(),
                })
            }
        },
        Ok(None) => Json(ResponPesan { status: "gagal".to_string(), pesan: "Wilayah tidak ditemukan.".to_string() }),
        Err(e) => Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
    }
}

// Fungsi Tambah Kategori
#[utoipa::path(
    post,
    path = "/api/kategori",
    request_body = InputKategori,
    responses(
        (status = 200, description = "Kategori berhasil ditambahkan", body = ResponPesan),
        (status = 500, description = "Gagal menambahkan kategori", body = ResponPesan)
    ),
    tag = "Kategori",
    security(("jwt_auth" = []))
)]
pub async fn tambah_kategori(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputKategori>,
) -> Json<ResponPesan> {
    
    let kategori_baru = kategori_sampah::ActiveModel {
        nama_kategori: Set(payload.nama_kategori.clone()),
        harga_per_kg: Set(payload.harga_per_kg),
        ..Default::default()
    };

    match kategori_baru.insert(&db).await {
        Ok(_) => Json(ResponPesan {
            status: "sukses".to_string(),
            pesan: format!("Kategori '{}' dengan harga Rp{}/kg berhasil ditambahkan.", payload.nama_kategori, payload.harga_per_kg),
        }),
        Err(_) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Gagal menambahkan kategori. Nama kategori mungkin sudah ada.".to_string(),
        }),
    }
}

// 2. Fungsi Lihat Semua Kategori
#[utoipa::path(
    get,
    path = "/api/kategori",
    responses(
        (status = 200, description = "Berhasil mengambil data kategori", body = serde_json::Value),
        (status = 500, description = "Gagal mengambil data kategori", body = serde_json::Value)
    ),
    tag = "Kategori",
    security(("jwt_auth" = []))
)]
pub async fn lihat_kategori(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    
    let daftar_kategori = kategori_sampah::Entity::find().all(&db).await;

    match daftar_kategori {
        Ok(data) => Json(serde_json::json!({
            "status": "sukses",
            "data": data
        })),
        Err(_) => Json(serde_json::json!({
            "status": "error",
            "pesan": "Gagal mengambil data kategori"
        })),
    }
}

// Fungsi Update Kategori Sampah (Misal untuk mengubah harga)
#[utoipa::path(
    put,
    path = "/api/kategori/{id}",
    request_body = InputKategori,
    params(
        ("id" = i32, Path, description = "ID Kategori yang ingin diupdate")
    ),
    responses(
        (status = 200, description = "Kategori berhasil diupdate", body = ResponPesan),
        (status = 404, description = "Kategori tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem", body = ResponPesan)
    ),
    tag = "Kategori",
    security(("jwt_auth" = []))
)]
pub async fn update_kategori(
    State(db): State<DatabaseConnection>,
    Path(kategori_id): Path<i32>,
    Json(payload): Json<InputKategori>,
) -> Json<ResponPesan> {
    
    // 1. Cari kategori berdasarkan ID di URL
    let pencarian_kategori = kategori_sampah::Entity::find_by_id(kategori_id).one(&db).await;

    match pencarian_kategori {
        Ok(Some(kategori_lama)) => {
            // 2. Ubah data lamanya menjadi ActiveModel agar bisa diedit
            let mut kategori_aktif: kategori_sampah::ActiveModel = kategori_lama.into();
            
            // 3. Timpa dengan data baru dari payload
            kategori_aktif.nama_kategori = Set(payload.nama_kategori.clone());
            kategori_aktif.harga_per_kg = Set(payload.harga_per_kg);

            // 4. Simpan pembaruan ke database
            match kategori_aktif.update(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!(
                        "Kategori ID {} berhasil diupdate menjadi '{}' dengan harga Rp {}/kg.", 
                        kategori_id, payload.nama_kategori, payload.harga_per_kg
                    ),
                }),
                Err(e) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Gagal mengupdate kategori: {}", e),
                })
            }
        },
        Ok(None) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: format!("Kategori dengan ID {} tidak ditemukan.", kategori_id),
        }),
        Err(e) => Json(ResponPesan {
            status: "error".to_string(),
            pesan: format!("Terjadi kesalahan sistem: {}", e),
        })
    }
}

// 3. Fungsi Hapus Kategori (DELETE)
#[utoipa::path(
    delete,
    path = "/api/kategori/{id}",
    params(
        ("id" = i32, Path, description = "ID Kategori yang ingin dihapus")
    ),
    responses(
        (status = 200, description = "Kategori berhasil dihapus", body = ResponPesan),
        (status = 404, description = "Kategori tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem", body = ResponPesan)
    ),
    tag = "Kategori",
    security(("jwt_auth" = []))
)]
pub async fn hapus_kategori(
    State(db): State<DatabaseConnection>,
    Path(kategori_id): Path<i32>,
) -> Json<ResponPesan> {
    let pencarian = kategori_sampah::Entity::find_by_id(kategori_id).one(&db).await;

    match pencarian {
        Ok(Some(data)) => {
            match data.delete(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Kategori ID {} berhasil dihapus dari sistem.", kategori_id),
                }),
                Err(_) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: "Gagal menghapus! Kategori ini kemungkinan sudah dipakai di dalam riwayat transaksi. Harap biarkan untuk menjaga integritas data sejarah.".to_string(),
                })
            }
        },
        Ok(None) => Json(ResponPesan { status: "gagal".to_string(), pesan: "Kategori tidak ditemukan.".to_string() }),
        Err(e) => Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
    }
}

// 3. Fungsi Tambah Transaksi
#[utoipa::path(
    post,
    path = "/api/transaksi",
    request_body = InputTransaksi,
    responses(
        (status = 200, description = "Transaksi berhasil dicatat", body = ResponPesan),
        (status = 500, description = "Gagal mencatat transaksi", body = ResponPesan)
    ),
    tag = "Transaksi",
    security(("jwt_auth" = []))
)]
pub async fn tambah_transaksi(
    State(db): State<DatabaseConnection>,
    headers: HeaderMap, // Tangkap header untuk membaca JWT
    Extension(tx): Extension<tokio::sync::broadcast::Sender<String>>, // Tarik channel WebSocket
    Json(payload): Json<InputTransaksi>,
) -> Json<ResponPesan> {
    
    // --- TAHAP 1: BACA IDENTITAS PETUGAS DARI JWT ---
    let token_lengkap = headers.get("Authorization").unwrap().to_str().unwrap();
    let token_asli = &token_lengkap[7..];
    let kunci_rahasia = std::env::var("JWT_SECRET")
        .expect("Waduh, JWT_SECRET belum diatur di file .env!")
        .into_bytes();
    
    let data_ktp = decode::<KlaimToken>(
        token_asli, 
        &DecodingKey::from_secret(&kunci_rahasia), 
        &Validation::default()
    ).unwrap();

    let pencarian_petugas = user::Entity::find()
        .filter(user::Column::Username.eq(data_ktp.claims.sub))
        .one(&db)
        .await;
    
    let petugas = match pencarian_petugas {
        Ok(Some(p)) => p, 
        _ => return Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Akses ditolak! Akun di token JWT ini sudah tidak ada di database. Silakan login ulang.".to_string(),
        }),
    };

    // --- TAHAP 1.2: VALIDASI ROLE & WILAYAH ---
    // Hanya BEM Wilayah yang bisa input, dan mereka wajib punya wilayah_id.
    // BEM KM/Admin tidak bisa input, mereka hanya audit.
    let id_wilayah_petugas = match petugas.role.as_str() {
        "dui" => {
            return Json(ResponPesan { status: "gagal".to_string(), pesan: "Akses ditolak! Role DUI hanya dapat melihat data (Read-Only).".to_string() });
        },
        "bem_km" | "admin" => {
            return Json(ResponPesan { status: "gagal".to_string(), pesan: "Akses ditolak! Administrator tidak dapat menginput transaksi, hanya BEM Wilayah.".to_string() });
        },
        _ => match petugas.wilayah_id {
            Some(id) => id,
            None => return Json(ResponPesan { status: "gagal".to_string(), pesan: "Akun Anda tidak terasosiasi dengan wilayah manapun. Hubungi admin.".to_string() }),
        }
    };

    // --- TAHAP 1.5: GEMBOK KEAMANAN (CEK STATUS WILAYAH) ---
    let pencarian_wilayah = wilayah::Entity::find_by_id(id_wilayah_petugas).one(&db).await;
    // Kita tangkap nama wilayahnya sekalian untuk isi pesan notifikasi
    let nama_wilayah_penginput = match pencarian_wilayah {
        Ok(Some(w)) => {
            // Kalau ketemu, tapi statusnya bukan Aktif, tolak setorannya!
            if w.status != "Aktif" {
                return Json(ResponPesan { status: "gagal".to_string(), pesan: format!("Setoran ditolak! Wilayah '{}' saat ini berstatus Nonaktif.", w.nama) });
            }
            w.nama
        },
        // Ini seharusnya tidak terjadi jika data konsisten, tapi sebagai pengaman
        Ok(None) => return Json(ResponPesan { status: "gagal".to_string(), pesan: "Wilayah yang terdaftar di akun Anda tidak ditemukan di sistem.".to_string() }),
        Err(e) => return Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
    };


    // --- TAHAP 2: AMBIL HARGA KATEGORI ---
    let pencarian_kategori = kategori_sampah::Entity::find_by_id(payload.kategori_id).one(&db).await;
    let kategori = match pencarian_kategori {
        Ok(Some(k)) => k,
        _ => return Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Kategori sampah tidak ditemukan di sistem!".to_string(),
        }),
    };

    // --- TAHAP 3: KALKULASI INTEGER MURNI ---
    let kalkulasi_total_nilai = (payload.berat_gram * kategori.harga_per_kg) / 1000;

    // --- TAHAP 3.5: PARSING TANGGAL TRANSAKSI ---
    let tanggal_parsed = if let Some(ref tgl) = payload.tanggal {
        chrono::NaiveDateTime::parse_from_str(&format!("{} 00:00:00", tgl), "%Y-%m-%d %H:%M:%S")
            .unwrap_or_else(|_| Utc::now().naive_utc())
    } else {
        Utc::now().naive_utc()
    };

    // --- TAHAP 4: SIMPAN KE BRANKAS ---
    let transaksi_baru = transaksi_sampah::ActiveModel {
        berat: Set(payload.berat_gram),
        total_nilai: Set(kalkulasi_total_nilai),
        status: Set("Selesai".to_string()),
        kategori_id: Set(payload.kategori_id),
        wilayah_id: Set(id_wilayah_petugas),
        poin_kualitas: Set(payload.poin_kualitas), // Simpan poinnya
        catatan: Set(payload.catatan), 
        input_by: Set(petugas.id), 
        tanggal: Set(tanggal_parsed), // Simpan tanggal manual
        ..Default::default()
    };

    match transaksi_baru.insert(&db).await {
    Ok(_) => {
        // --- TAHAP 5: OTOMATISASI SALDO TABUNGAN WILAYAH ---
        let pencarian_dompet = tabungan_sampah::Entity::find()
            .filter(tabungan_sampah::Column::WilayahId.eq(id_wilayah_petugas))
            .one(&db)
            .await
            .unwrap();

        match pencarian_dompet {
            Some(dompet_lama) => {
                let mut dompet_aktif: tabungan_sampah::ActiveModel = dompet_lama.into();
                let saldo_sekarang = dompet_aktif.saldo.clone().unwrap(); 
                
                dompet_aktif.saldo = Set(saldo_sekarang + kalkulasi_total_nilai);
                let _ = dompet_aktif.update(&db).await; 
            },
            None => {
                let dompet_baru = tabungan_sampah::ActiveModel {
                    saldo: Set(kalkulasi_total_nilai),
                    status: Set("Aktif".to_string()),
                    wilayah_id: Set(id_wilayah_petugas),
                    ..Default::default()
                };
                let _ = dompet_baru.insert(&db).await;
            }
        }

        // --- TAHAP 6: BROADCAST NOTIFIKASI WEBSOCKET ---
        let pesan_notif = serde_json::json!({
            "tipe": "transaksi",
            "judul": format!("Setoran Baru: {}", nama_wilayah_penginput),
            "deskripsi": format!("Setoran seberat {} gram setara Rp{} telah dicatat & menunggu audit.", payload.berat_gram, kalkulasi_total_nilai),
            "target_role": ["admin", "bem_km", "dui"] // Hanya Admin yang terima
        }).to_string();
        let _ = tx.send(pesan_notif); // Abaikan error jika belum ada client frontend yang terhubung

        Json(ResponPesan {
            status: "sukses".to_string(),
            pesan: format!(
                "Mantap! Setoran seberat {} gram setara dengan Rp {} berhasil dicatat dan otomatis masuk ke tabungan wilayah.", 
                payload.berat_gram, kalkulasi_total_nilai
            ),
        })
    },
    Err(e) => Json(ResponPesan {
        status: "gagal".to_string(),
        pesan: format!("Gagal mencatat transaksi. Error: {}", e),
    }),
    }
}

// 1. Fungsi Lihat Transaksi (Membaca 4 Tabel Sekaligus!)
#[utoipa::path(
    get,
    path = "/api/transaksi",
    responses(
        (status = 200, description = "Berhasil mengambil data transaksi", body = serde_json::Value),
        (status = 500, description = "Gagal mengambil data transaksi", body = serde_json::Value)
    ),
    tag = "Transaksi",
    security(("jwt_auth" = []))
)]
pub async fn lihat_transaksi(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>, // Ambil identitas user login
) -> Json<serde_json::Value> {
    
    // Cari data user untuk mengecek Role dan wilayah_id-nya
    let pencarian_user = user::Entity::find()
        .filter(user::Column::Username.eq(username_jwt))
        .one(&db)
        .await
        .unwrap();

    let (role, wilayah_id) = match pencarian_user {
        Some(u) => (u.role, u.wilayah_id),
        None => return Json(serde_json::json!({ "status": "gagal", "pesan": "User tidak valid" })),
    };

    // Mulai query
    let mut query = transaksi_sampah::Entity::find()
        // Pilih kolom tambahan yang mau dicomot dari tabel tetangga
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .column_as(wilayah::Column::Nama, "nama_wilayah")
        .column_as(user::Column::Nama, "nama_petugas")
        // Jika kamu sudah update Sea-ORM Entity untuk catatan, tambahkan juga kolomnya di sini
        // Lakukan penggabungan (Inner Join) berdasarkan Foreign Key
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::Wilayah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::User.def());

    // FILTER: Jika dia BEM Wilayah, HANYA BISA LIHAT transaksinya sendiri
    if role != "bem_km" && role != "admin" && role != "dui" {
        if let Some(id_wil) = wilayah_id {
            query = query.filter(transaksi_sampah::Column::WilayahId.eq(id_wil));
        }
    }

    let hasil_eksekusi = query
        // Tuangkan hasilnya ke dalam cetakan JSON yang kita buat tadi
        .into_model::<TransaksiLengkap>()
        .all(&db)
        .await;

    match hasil_eksekusi {
        Ok(data) => Json(serde_json::json!({
            "status": "sukses",
            "data": data
        })),
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal mengambil data transaksi: {}", e)
        })),
    }
}

// Fungsi Export Transaksi (Mendukung Filter Tanggal & Wilayah)
#[utoipa::path(
    get,
    path = "/api/transaksi/export",
    params(
        ("tanggal_mulai" = Option<String>, Query, description = "Filter tanggal mulai (YYYY-MM-DD)"),
        ("tanggal_akhir" = Option<String>, Query, description = "Filter tanggal akhir (YYYY-MM-DD)"),
        ("wilayah_id" = Option<i32>, Query, description = "Filter ID Wilayah (Hanya untuk Admin/DUI)")
    ),
    responses(
        (status = 200, description = "Berhasil mengambil data transaksi untuk diexport", body = serde_json::Value),
        (status = 500, description = "Gagal mengambil data transaksi", body = serde_json::Value)
    ),
    tag = "Transaksi",
    security(("jwt_auth" = []))
)]
pub async fn export_transaksi(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>,
    Query(filter): Query<FilterExport>,
) -> Json<serde_json::Value> {
    
    let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
    let role = user_login.role;
    let id_wil_user = user_login.wilayah_id;

    let mut query = transaksi_sampah::Entity::find()
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .column_as(wilayah::Column::Nama, "nama_wilayah")
        .column_as(user::Column::Nama, "nama_petugas")
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::Wilayah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::User.def());

    // FILTER HAK AKSES WILAYAH
    if role != "bem_km" && role != "admin" && role != "dui" {
        if let Some(id_wil) = id_wil_user {
            query = query.filter(transaksi_sampah::Column::WilayahId.eq(id_wil));
        }
    } else {
        // Admin/DUI bisa memfilter laporan berdasarkan wilayah tertentu
        if let Some(id_wil_filter) = filter.wilayah_id {
            query = query.filter(transaksi_sampah::Column::WilayahId.eq(id_wil_filter));
        }
    }

    // FILTER TANGGAL
    if let (Some(mulai), Some(akhir)) = (filter.tanggal_mulai, filter.tanggal_akhir) {
        let start = format!("{} 00:00:00", mulai);
        let end = format!("{} 23:59:59", akhir);
        query = query.filter(transaksi_sampah::Column::Tanggal.between(start, end));
    }

    // Urutkan dari transaksi terbaru ke terlama
    query = query.order_by_desc(transaksi_sampah::Column::Tanggal);

    let hasil_eksekusi = query.into_model::<TransaksiLengkap>().all(&db).await;

    match hasil_eksekusi {
        Ok(data) => Json(serde_json::json!({ "status": "sukses", "total_data": data.len(), "data": data })),
        Err(e) => Json(serde_json::json!({ "status": "error", "pesan": format!("Gagal mengambil data untuk export: {}", e) })),
    }
}

// 2. Fungsi Lihat Tabungan (Membaca 2 Tabel)
#[utoipa::path(
    get,
    path = "/api/tabungan",
    responses(
        (status = 200, description = "Berhasil mengambil data tabungan", body = serde_json::Value),
        (status = 500, description = "Gagal mengambil data tabungan", body = serde_json::Value)
    ),
    tag = "Tabungan",
    security(("jwt_auth" = []))
)]
pub async fn lihat_tabungan(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    
    let query_tabungan = tabungan_sampah::Entity::find()
        .column_as(wilayah::Column::Nama, "nama_wilayah")
        .join(JoinType::InnerJoin, tabungan_sampah::Relation::Wilayah.def())
        .into_model::<TabunganLengkap>()
        .all(&db)
        .await;

    match query_tabungan {
        Ok(data) => Json(serde_json::json!({
            "status": "sukses",
            "data": data
        })),
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal mengambil data tabungan: {}", e)
        })),
    }
}

// Fungsi Update / Edit Transaksi (Otomatis Penyesuaian Saldo)
#[utoipa::path(
    put,
    path = "/api/transaksi/{id}",
    request_body = InputTransaksi,
    params(
        ("id" = i32, Path, description = "ID Transaksi yang ingin diedit/diupdate")
    ),
    responses(
        (status = 200, description = "Transaksi berhasil diperbarui dan saldo disesuaikan", body = ResponPesan),
        (status = 403, description = "Akses ditolak: Hanya Admin/DUI/Pemilik yang bisa edit", body = ResponPesan),
        (status = 404, description = "Transaksi atau Kategori tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem", body = ResponPesan)
    ),
    tag = "Transaksi",
    security(("jwt_auth" = []))
)]
pub async fn update_transaksi(
    State(db): State<DatabaseConnection>,
    Path(transaksi_id): Path<i32>,
    Extension(username_jwt): Extension<String>,
    Extension(tx): Extension<tokio::sync::broadcast::Sender<String>>, // Tarik channel WebSocket
    Json(payload): Json<InputTransaksi>,
) -> Json<ResponPesan> {
    
    // 1. Cari data transaksi lama
    let pencarian_transaksi = transaksi_sampah::Entity::find_by_id(transaksi_id).one(&db).await;
    let data_trx_lama = match pencarian_transaksi {
        Ok(Some(t)) => t,
        _ => return Json(ResponPesan { status: "gagal".to_string(), pesan: format!("Transaksi ID {} tidak ditemukan.", transaksi_id) }),
    };

    // 2. Cek Hak Akses (Otorisasi)
    let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
    
    if user_login.role == "dui" {
        return Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Akses ditolak! Role DUI hanya memiliki hak akses untuk melihat data (Read-Only).".to_string(),
        });
    }

    if user_login.role != "bem_km" && user_login.role != "admin" {
        return Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Akses ditolak! Hanya Administrator (BEM KM / Admin) yang dapat mengedit transaksi untuk alasan keamanan.".to_string(),
        });
    }

    // 3. Ambil Harga Kategori Baru
    let pencarian_kategori = kategori_sampah::Entity::find_by_id(payload.kategori_id).one(&db).await;
    let kategori = match pencarian_kategori {
        Ok(Some(k)) => k,
        _ => return Json(ResponPesan { status: "gagal".to_string(), pesan: "Kategori sampah tidak ditemukan di sistem!".to_string() }),
    };

    // 4. Hitung Nilai Baru & Hitung Selisih dengan Nilai Lama
    let kalkulasi_total_nilai_baru = (payload.berat_gram * kategori.harga_per_kg) / 1000;
    let selisih_nilai = kalkulasi_total_nilai_baru - data_trx_lama.total_nilai;
    let id_wilayah = data_trx_lama.wilayah_id;
    let tanggal_lama = data_trx_lama.tanggal;

    let tanggal_parsed = if let Some(ref tgl) = payload.tanggal {
        NaiveDateTime::parse_from_str(&format!("{} 00:00:00", tgl), "%Y-%m-%d %H:%M:%S").unwrap_or(tanggal_lama)
    } else {
        tanggal_lama
    };

    // 5. Update Record Transaksi di Tabel
    let mut trx_aktif: transaksi_sampah::ActiveModel = data_trx_lama.into();
    trx_aktif.berat = Set(payload.berat_gram);
    trx_aktif.total_nilai = Set(kalkulasi_total_nilai_baru);
    trx_aktif.kategori_id = Set(payload.kategori_id);
    trx_aktif.poin_kualitas = Set(payload.poin_kualitas);
    trx_aktif.catatan = Set(payload.catatan);
    trx_aktif.tanggal = Set(tanggal_parsed);

    if let Err(e) = trx_aktif.update(&db).await {
        return Json(ResponPesan { status: "gagal".to_string(), pesan: format!("Gagal menyimpan perubahan transaksi: {}", e) });
    }

    // 6. Penyesuaian Otomatis Dompet (Tabungan)
    // Jika selisih_nilai positif (menguntungkan), tambah saldo. Jika negatif (merugikan), kurangi saldo.
    if selisih_nilai != 0 {
        let pencarian_dompet = tabungan_sampah::Entity::find().filter(tabungan_sampah::Column::WilayahId.eq(id_wilayah)).one(&db).await.unwrap();

        if let Some(dompet_lama) = pencarian_dompet {
            let mut dompet_aktif: tabungan_sampah::ActiveModel = dompet_lama.into();
            let saldo_sekarang = dompet_aktif.saldo.clone().unwrap();
            dompet_aktif.saldo = Set(saldo_sekarang + selisih_nilai);
            let _ = dompet_aktif.update(&db).await;
        } else if selisih_nilai > 0 { // Just in case, buat dompet baru kalau belum ada
            let dompet_baru = tabungan_sampah::ActiveModel {
                saldo: Set(selisih_nilai),
                status: Set("Aktif".to_string()),
                wilayah_id: Set(id_wilayah),
                ..Default::default()
            };
            let _ = dompet_baru.insert(&db).await;
        }
    }

    // BROADCAST NOTIFIKASI KE WILAYAH TERKAIT
    let pesan_notif = serde_json::json!({
        "tipe": "update_transaksi",
        "judul": "Penilaian Transaksi Diperbarui",
        "deskripsi": format!("Transaksi Anda telah dinilai/diedit oleh Admin. Saldo disesuaikan Rp {}.", selisih_nilai),
        "target_wilayah_id": id_wilayah
    }).to_string();
    let _ = tx.send(pesan_notif);

    Json(ResponPesan {
        status: "sukses".to_string(),
        pesan: format!("Transaksi berhasil diperbarui! Saldo otomatis disesuaikan sebesar Rp {}", selisih_nilai),
    })
}

// Fungsi Hapus Transaksi (Dilengkapi dengan Auto-Kurang Saldo)
#[utoipa::path(
    delete,
    path = "/api/transaksi/{id}",
    params(
        ("id" = i32, Path, description = "ID Transaksi yang ingin dihapus")
    ),
    responses(
        (status = 200, description = "Transaksi berhasil dihapus", body = ResponPesan),
        (status = 404, description = "Transaksi tidak ditemukan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem", body = ResponPesan)
    ),
    tag = "Transaksi",
    security(("jwt_auth" = []))
)]
pub async fn hapus_transaksi(
    State(db): State<DatabaseConnection>,
    Path(transaksi_id): Path<i32>, // Mengambil ID dari URL
    Extension(username_jwt): Extension<String>,
    Extension(tx): Extension<tokio::sync::broadcast::Sender<String>>, // Tarik channel WebSocket
) -> Json<ResponPesan> {
    
    // 1. Cari data transaksi yang mau dihapus
    let pencarian_transaksi = transaksi_sampah::Entity::find_by_id(transaksi_id).one(&db).await;

    match pencarian_transaksi {
        Ok(Some(data_trx)) => {
            // CEK HAK AKSES: Apakah yang menghapus adalah pemilik transaksinya?
            let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
            
            if user_login.role == "dui" {
                return Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: "Akses ditolak! Role DUI hanya memiliki hak akses untuk melihat data (Read-Only).".to_string(),
                });
            }

            if user_login.role != "bem_km" && user_login.role != "admin" {
                if user_login.wilayah_id != Some(data_trx.wilayah_id) {
                    return Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: "Akses ditolak! Anda tidak boleh memanipulasi/menghapus transaksi milik wilayah lain.".to_string(),
                    });
                }
            }

            // Ambil informasi nilai dan wilayah sebelum transaksinya dimusnahkan
            let nilai_yang_dihapus = data_trx.total_nilai;
            let id_wilayah = data_trx.wilayah_id;

            // 2. Cari dompet tabungan wilayah tersebut
            let pencarian_dompet = tabungan_sampah::Entity::find()
                .filter(tabungan_sampah::Column::WilayahId.eq(id_wilayah))
                .one(&db)
                .await
                .unwrap();

            // 3. Tarik kembali saldonya (kalau dompetnya ada)
            if let Some(dompet_lama) = pencarian_dompet {
                let mut dompet_aktif: tabungan_sampah::ActiveModel = dompet_lama.into();
                let saldo_sekarang = dompet_aktif.saldo.clone().unwrap();
                
                // Kurangi saldo saat ini dengan nilai transaksi yang salah tadi
                dompet_aktif.saldo = Set(saldo_sekarang - nilai_yang_dihapus);
                let _ = dompet_aktif.update(&db).await;
            }

            // 4. Terakhir, hapus data transaksinya secara permanen dari brankas
            match data_trx.delete(&db).await {
                Ok(_) => {
                    // BROADCAST NOTIFIKASI PEMBATALAN
                    let pesan_notif = serde_json::json!({
                        "tipe": "hapus_transaksi",
                        "judul": "Transaksi Dibatalkan",
                        "deskripsi": format!("Admin membatalkan transaksi Anda. Saldo tabungan ditarik kembali Rp {}.", nilai_yang_dihapus),
                        "target_wilayah_id": id_wilayah
                    }).to_string();
                    let _ = tx.send(pesan_notif);

                    Json(ResponPesan {
                        status: "sukses".to_string(),
                        pesan: format!("Transaksi ID {} berhasil dihapus dan saldo tabungan otomatis ditarik kembali sebesar Rp {}.", transaksi_id, nilai_yang_dihapus),
                    })
                },
                Err(e) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Gagal menghapus transaksi dari database: {}", e),
                })
            }
        },
        Ok(None) => {
            Json(ResponPesan {
                status: "gagal".to_string(),
                pesan: format!("Transaksi dengan ID {} tidak ditemukan.", transaksi_id),
            })
        },
        Err(e) => {
            Json(ResponPesan {
                status: "error".to_string(),
                pesan: format!("Terjadi kesalahan sistem saat mencari transaksi: {}", e),
            })
        }
    }
}

// Fungsi Tarik Saldo (Hanya mengubah Tabungan, TIDAK menyentuh Transaksi)
#[utoipa::path(
    post,
    path = "/api/tabungan/tarik",
    request_body = InputTarik,
    responses(
        (status = 200, description = "Saldo berhasil ditarik", body = ResponPesan),
        (status = 404, description = "Wilayah belum memiliki catatan tabungan", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem", body = ResponPesan)
    ),
    tag = "Tabungan",
    security(("jwt_auth" = []))
)]
pub async fn tarik_saldo(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>,
    Json(payload): Json<InputTarik>,
) -> Json<ResponPesan> {
    
    // CEK HAK AKSES: BEM dilarang narik tabungan BEM wilayah lain!
    let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
    if user_login.role != "bem_km" && user_login.role != "admin" && user_login.role != "dui" {
        if user_login.wilayah_id != Some(payload.wilayah_id) {
            return Json(ResponPesan {
                status: "gagal".to_string(),
                pesan: "Akses ditolak! Anda tidak berhak mencairkan dana tabungan milik wilayah lain.".to_string(),
            });
        }
    }

    // 1. Cari dompet tabungan wilayah tersebut
    let pencarian_dompet = tabungan_sampah::Entity::find()
        .filter(tabungan_sampah::Column::WilayahId.eq(payload.wilayah_id))
        .one(&db)
        .await;

    match pencarian_dompet {
        Ok(Some(dompet_lama)) => {
            let mut dompet_aktif: tabungan_sampah::ActiveModel = dompet_lama.into();
            let saldo_sekarang = dompet_aktif.saldo.clone().unwrap();

            // 2. CEK PENGAMAN: Apakah saldonya cukup?
            if saldo_sekarang < payload.nominal {
                return Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!(
                        "Penarikan ditolak! Saldo BEM ini hanya Rp {}, sedangkan nominal tarikan Rp {}.", 
                        saldo_sekarang, payload.nominal
                    ),
                });
            }

            // 3. EKSEKUSI: Kurangi saldo saat ini
            let saldo_baru = saldo_sekarang - payload.nominal;
            dompet_aktif.saldo = Set(saldo_baru);
            
            match dompet_aktif.update(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!(
                        "Pencairan dana Rp {} berhasil. Sisa saldo tabungan saat ini: Rp {}.", 
                        payload.nominal, saldo_baru
                    ),
                }),
                Err(e) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Gagal memproses penarikan di database: {}", e),
                }),
            }
        },
        Ok(None) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Wilayah ini belum memiliki catatan tabungan (saldo masih Rp 0).".to_string(),
        }),
        Err(e) => Json(ResponPesan {
            status: "error".to_string(),
            pesan: format!("Terjadi kesalahan sistem: {}", e),
        }),
    }
}

#[utoipa::path(
    get,
    path = "/api/dashboard",
    responses(
        (status = 200, description = "Berhasil mengambil data dashboard", body = serde_json::Value),
        (status = 500, description = "Gagal menghitung rekap", body = serde_json::Value)
    ),
    tag = "Dashboard",
    security(("jwt_auth" = []))
)]
pub async fn lihat_dashboard(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {

    let query = transaksi_sampah::Entity::find()
        .select_only()
        .column_as(transaksi_sampah::Column::Berat.sum(), "total_berat_gram")
        .column_as(transaksi_sampah::Column::TotalNilai.sum(), "total_rupiah")
        .column_as(transaksi_sampah::Column::Id.count(), "jumlah_transaksi")
        .into_model::<RekapDashboard>()
        .one(&db)
        .await;

    match query {
        Ok(Some(data)) => {
            // Kita buka bungkus Option-nya. Kalau NULL, ubah jadi 0.
            let berat = data.total_berat_gram.unwrap_or(0);
            let rupiah = data.total_rupiah.unwrap_or(0);

            Json(serde_json::json!({
                "status": "sukses",
                "rekap_seluruh_ipb": {
                    "total_berat_gram": berat,
                    "total_rupiah": rupiah,
                    "jumlah_transaksi": data.jumlah_transaksi
                }
            }))
        },
        Ok(None) => Json(serde_json::json!({
            "status": "sukses",
            "rekap_seluruh_ipb": {
                "total_berat_gram": 0,
                "total_rupiah": 0,
                "jumlah_transaksi": 0
            }
        })),
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal menghitung rekap: {}", e)
        })),
    }
}

// Fungsi khusus mengambil Wilayah yang statusnya HANYA "Aktif"
#[utoipa::path(
    get,
    path = "/api/wilayah/aktif",
    responses(
        (status = 200, description = "Berhasil mengambil data wilayah aktif", body = serde_json::Value),
        (status = 500, description = "Gagal mengambil data wilayah aktif", body = serde_json::Value)
    ),
    tag = "Wilayah",
    security(("jwt_auth" = []))
)]
pub async fn lihat_wilayah_aktif(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    
    // Perhatikan bagian .filter ini!
    let pencarian = wilayah::Entity::find()
        .filter(wilayah::Column::Status.eq("Aktif"))
        .all(&db)
        .await;

    match pencarian {
        Ok(data) => Json(serde_json::json!({
            "status": "sukses",
            "data": data
        })),
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal mengambil data wilayah aktif: {}", e)
        })),
    }
}

// Dashboard Spesifik per Wilayah
#[utoipa::path(
    get,
    path = "/api/dashboard/{id}",
    params(
        ("id" = i32, Path, description = "ID Wilayah")
    ),
    responses(
        (status = 200, description = "Berhasil mengambil data dashboard wilayah", body = serde_json::Value),
        (status = 500, description = "Gagal menghitung rekap wilayah", body = serde_json::Value)
    ),
    tag = "Dashboard",
    security(("jwt_auth" = []))
)]
pub async fn lihat_dashboard_wilayah(
    State(db): State<DatabaseConnection>,
    Path(wilayah_id): Path<i32>,
    Extension(username_jwt): Extension<String>,
) -> Json<serde_json::Value> {
    
    // CEK HAK AKSES: Kunci agar BEM tidak bisa mengintip ringkasan dashboard BEM saingannya
    let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
    if user_login.role != "bem_km" && user_login.role != "admin" && user_login.role != "dui" {
        if user_login.wilayah_id != Some(wilayah_id) {
            return Json(serde_json::json!({
                "status": "gagal",
                "pesan": "Akses ditolak! Anda hanya boleh melihat detail dashboard wilayah Anda sendiri."
            }));
        }
    }

    // 1. Cek dulu apakah wilayahnya ada, sekalian ambil namanya untuk ditampilkan
    let pencarian_wilayah = wilayah::Entity::find_by_id(wilayah_id).one(&db).await;
    let nama_wilayah = match pencarian_wilayah {
        Ok(Some(w)) => w.nama,
        Ok(None) => return Json(serde_json::json!({
            "status": "gagal",
            "pesan": format!("Wilayah dengan ID {} tidak ditemukan.", wilayah_id)
        })),
        Err(e) => return Json(serde_json::json!({
            "status": "error",
            "pesan": e.to_string()
        })),
    };

    // 1.5. Hitung Breakdown Kategori (Untuk Pie Chart)
    let transaksi_kategori = transaksi_sampah::Entity::find()
        .filter(transaksi_sampah::Column::WilayahId.eq(wilayah_id))
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .into_model::<TransaksiKategoriBiasa>()
        .all(&db)
        .await
        .unwrap_or_default();

    let mut breakdown: HashMap<String, (i64, i64)> = HashMap::new();
    for t in transaksi_kategori {
        let entry = breakdown.entry(t.nama_kategori).or_insert((0,0));
        entry.0 += t.berat as i64;
        entry.1 += t.total_nilai as i64;
    }
    let breakdown_list: Vec<_> = breakdown.into_iter().map(|(nama, (b, n))| {
        serde_json::json!({ "nama_kategori": nama, "total_berat_gram": b, "total_rupiah": n })
    }).collect();

    // 1.8. Hitung Grafik Aktivitas Bulanan (Berdasarkan Bulan dari Tanggal Transaksi)
    let semua_trx_wilayah = transaksi_sampah::Entity::find()
        .filter(transaksi_sampah::Column::WilayahId.eq(wilayah_id))
        .all(&db)
        .await
        .unwrap_or_default();

    let mut data_bulanan = vec![
        serde_json::json!({"bulan": "Jan", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Feb", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Mar", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Apr", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Mei", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Jun", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Jul", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Ags", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Sep", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Okt", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Nov", "berat": 0, "rupiah": 0}),
        serde_json::json!({"bulan": "Des", "berat": 0, "rupiah": 0}),
    ];

    for trx in semua_trx_wilayah {
        let bulan_idx = trx.tanggal.month() as usize - 1; 
        if let Some(obj) = data_bulanan[bulan_idx].as_object_mut() {
            let berat_lama = obj.get("berat").unwrap().as_i64().unwrap();
            let rupiah_lama = obj.get("rupiah").unwrap().as_i64().unwrap();
            
            obj.insert("berat".to_string(), serde_json::json!(berat_lama + trx.berat as i64));
            obj.insert("rupiah".to_string(), serde_json::json!(rupiah_lama + trx.total_nilai as i64));
        }
    }

    // 2. Hitung agregasi KHUSUS untuk wilayah ini saja
    let query = transaksi_sampah::Entity::find()
        .filter(transaksi_sampah::Column::WilayahId.eq(wilayah_id)) // INI KUNCI FILTERNYA!
        .select_only()
        .column_as(transaksi_sampah::Column::Berat.sum(), "total_berat_gram")
        .column_as(transaksi_sampah::Column::TotalNilai.sum(), "total_rupiah")
        .column_as(transaksi_sampah::Column::Id.count(), "jumlah_transaksi")
        .into_model::<RekapDashboard>() // Kita reuse struct yang lama
        .one(&db)
        .await;

    match query {
        Ok(Some(data)) => {
            // Buka bungkus Option, kalau wilayahnya belum pernah setor, jadikan 0
            let berat = data.total_berat_gram.unwrap_or(0);
            let rupiah = data.total_rupiah.unwrap_or(0);

            Json(serde_json::json!({
                "status": "sukses",
                "nama_wilayah": nama_wilayah,
                "rekap_wilayah": {
                    "total_berat_gram": berat,
                    "total_rupiah": rupiah,
                    "jumlah_transaksi": data.jumlah_transaksi
                },
                "breakdown_kategori": breakdown_list,
                "grafik_bulanan": data_bulanan
            }))
        },
        Ok(None) => Json(serde_json::json!({
            "status": "sukses",
            "nama_wilayah": nama_wilayah,
            "rekap_wilayah": {
                "total_berat_gram": 0,
                "total_rupiah": 0,
                "jumlah_transaksi": 0
            },
            "breakdown_kategori": [],
            "grafik_bulanan": data_bulanan
        })),
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal menghitung rekap wilayah: {}", e)
        })),
    }
}

// Fungsi Endpoint Leaderboard KPI
#[utoipa::path(
    get,
    path = "/api/dashboard/leaderboard",
    params(
        ("tanggal_mulai" = Option<String>, Query, description = "Filter tanggal mulai (YYYY-MM-DD)"),
        ("tanggal_akhir" = Option<String>, Query, description = "Filter tanggal akhir (YYYY-MM-DD)")
    ),
    responses((status = 200, description = "Berhasil mengambil data leaderboard KPI")),
    tag = "Dashboard",
    security(("jwt_auth" = []))
)]
pub async fn lihat_leaderboard(
    State(db): State<DatabaseConnection>,
    Query(filter): Query<FilterLeaderboard>,
) -> Json<serde_json::Value> {
    // Ambil seluruh transaksi gabungan dengan wilayah
    let mut query = transaksi_sampah::Entity::find()
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .column_as(wilayah::Column::Nama, "nama_wilayah")
        .column_as(user::Column::Nama, "nama_petugas")
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::Wilayah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::User.def());

    // Terapkan Filter Tanggal (Per 2 Bulan / Sesuai Periode Frontend)
    if let (Some(mulai), Some(akhir)) = (filter.tanggal_mulai, filter.tanggal_akhir) {
        let start = format!("{} 00:00:00", mulai);
        let end = format!("{} 23:59:59", akhir);
        query = query.filter(transaksi_sampah::Column::Tanggal.between(start, end));
    }

    let semua_transaksi = query
        .into_model::<TransaksiLengkap>()
        .all(&db)
        .await
        .unwrap_or_default();
    
    // Menyimpan agregasi data: (total_berat, total_nilai, total_poin_kualitas, jumlah_transaksi)
    let mut rekap_wilayah: HashMap<String, (i64, i64, i64, i64)> = HashMap::new();
    
    for t in semua_transaksi {
        let entry = rekap_wilayah.entry(t.nama_wilayah).or_insert((0, 0, 0, 0));
        entry.0 += t.berat as i64;
        entry.1 += t.total_nilai as i64;
        entry.2 += t.poin_kualitas as i64;
        entry.3 += 1;
    }
    
    // Cari nilai tertinggi untuk KPI 2 dan KPI 3 sebagai pembanding relatif
    let mut max_berat = 0;
    let mut max_nilai = 0;
    for &(berat, nilai, _, _) in rekap_wilayah.values() {
        if berat > max_berat { max_berat = berat; }
        if nilai > max_nilai { max_nilai = nilai; }
    }
    
    let mut leaderboard: Vec<LeaderboardItem> = rekap_wilayah.into_iter().map(|(nama, (berat, nilai, tot_kualitas, jml_trx))| {
        
        // KPI 1: Rata-Rata Kualitas Pemilahan Sampah
        let kpi_1 = if jml_trx > 0 { tot_kualitas as f64 / jml_trx as f64 } else { 0.0 };

        // KPI 2: Total Input Sampah Relatif (Maks 40)
        let kpi_2 = if max_berat > 0 { (berat as f64 / max_berat as f64) * 40.0 } else { 0.0 };

        // KPI 3: Total Nilai Ekonomi Relatif (Maks 30)
        let kpi_3 = if max_nilai > 0 { (nilai as f64 / max_nilai as f64) * 30.0 } else { 0.0 };

        // Total Skor Akhir (Maks 100 poin)
        let total_skor = (kpi_1 + kpi_2 + kpi_3).round() as i64;

        LeaderboardItem {
            peringkat: 0,
            nama_wilayah: nama,
            poin_kpi: total_skor,
            total_berat_gram: berat,
            total_rupiah: nilai,
        }
    }).collect();
    
    // Urutkan berdasarkan Poin tertinggi. Jika Seri, urutkan dari Berat sampah terbanyak.
    leaderboard.sort_by(|a, b| b.poin_kpi.cmp(&a.poin_kpi).then(b.total_berat_gram.cmp(&a.total_berat_gram)));
    for (i, item) in leaderboard.iter_mut().enumerate() { item.peringkat = i + 1; }
    
    Json(serde_json::json!({ "status": "sukses", "data": leaderboard }))
}

// Fungsi Endpoint Aktivitas / Notifikasi Terbaru
#[utoipa::path(
    get,
    path = "/api/dashboard/{id}/aktivitas",
    params(("id" = i32, Path, description = "ID Wilayah")),
    responses((status = 200, description = "Berhasil mengambil aktivitas terbaru")),
    tag = "Dashboard",
    security(("jwt_auth" = []))
)]
pub async fn lihat_aktivitas_terbaru(
    State(db): State<DatabaseConnection>,
    Path(wilayah_id): Path<i32>,
    Extension(username_jwt): Extension<String>,
) -> Json<serde_json::Value> {

    // CEK HAK AKSES
    let user_login = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await.unwrap().unwrap();
    if user_login.role != "bem_km" && user_login.role != "admin" && user_login.role != "dui" {
        if user_login.wilayah_id != Some(wilayah_id) {
            return Json(serde_json::json!({ "status": "gagal", "pesan": "Akses ditolak!" }));
        }
    }

    let transaksi = transaksi_sampah::Entity::find()
        .filter(transaksi_sampah::Column::WilayahId.eq(wilayah_id))
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .order_by_desc(transaksi_sampah::Column::Id)
        .limit(10)
        .into_model::<TransaksiKategoriBiasa>()
        .all(&db).await.unwrap_or_default();
    
    let aktivitas: Vec<_> = transaksi.into_iter().map(|t| serde_json::json!({
        "judul": format!("Transaksi {} berhasil ditambahkan", t.nama_kategori.to_lowercase()),
        "deskripsi": format!("+{}kg {} dicatat ke sistem", t.berat / 1000, t.nama_kategori.to_lowercase()),
        "tipe": "transaksi",
        "waktu": t.tanggal.format("%d %b %Y").to_string(),
        "tanggal": t.tanggal
    })).collect();

    Json(serde_json::json!({ "status": "sukses", "data": aktivitas }))
}

// 1. Fungsi Request OTP via Email
#[utoipa::path(
    post,
    path = "/api/lupa-password",
    request_body = InputLupaPassword,
    responses(
        (status = 200, description = "OTP berhasil dibuat dan dikirim ke email", body = ResponPesan),
        (status = 403, description = "Akses ditolak: Akun dalam status nonaktif", body = ResponPesan),
        (status = 404, description = "Gagal: Email tidak terdaftar", body = ResponPesan),
        (status = 500, description = "Terjadi kesalahan sistem atau gagal mengirim email", body = ResponPesan)
    ),
    tag = "Auth"
)]
pub async fn minta_otp_email(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputLupaPassword>,
) -> (StatusCode, Json<ResponPesan>) { // <-- Tipe kembalian ditingkatkan
    
    // Cari user berdasarkan Email
    let pencarian = user::Entity::find()
        .filter(user::Column::Email.eq(payload.email.clone()))
        .one(&db)
        .await;

    match pencarian {
        Ok(Some(data_user)) => {
            if data_user.status != "Aktif" {
                return (
                    StatusCode::FORBIDDEN, // 403: Akun dilarang melakukan aksi
                    Json(ResponPesan { status: "gagal".to_string(), pesan: "Akun ini nonaktif.".to_string() })
                );
            }

            // Generate 6 Digit Angka
            let otp_string = {
                let mut rng = rand::rng();
                let kode_otp: u32 = rng.random_range(100000..999999);
                kode_otp.to_string()
            };

            let waktu_kadaluarsa = Utc::now().checked_add_signed(Duration::minutes(15)).unwrap().timestamp();

            // Simpan ke database
            let mut data_aktif: user::ActiveModel = data_user.clone().into();
            data_aktif.otp_reset = Set(Some(otp_string.clone()));
            data_aktif.otp_kadaluarsa = Set(Some(waktu_kadaluarsa));
            let _ = data_aktif.update(&db).await;

            // --- PROSES KIRIM EMAIL ---
            let smtp_host = std::env::var("SMTP_HOST").expect("SMTP_HOST belum diset");
            let smtp_email = std::env::var("SMTP_EMAIL").expect("SMTP_EMAIL belum diset");
            let smtp_password = std::env::var("SMTP_PASSWORD").expect("SMTP_PASSWORD belum diset");

            let email_pengirim = format!("Tabung Hijau IPB <{}>", smtp_email);
            
            let email_msg = Message::builder()
                .from(email_pengirim.parse().unwrap())
                .to(data_user.email.parse().unwrap())
                .subject("Kode OTP Reset Password - Tabung Hijau")
                .header(ContentType::TEXT_HTML)
                .body(format!(
                    "<h2>Halo, {}!</h2>
                    <p>Seseorang meminta reset password untuk akunmu.</p>
                    <p>Masukkan kode OTP berikut untuk melanjutkan:</p>
                    <h1 style='color: #2e7d32; letter-spacing: 5px;'>{}</h1>
                    <p>Kode ini hanya berlaku 15 menit. Jika kamu tidak memintanya, abaikan email ini.</p>",
                    data_user.nama, otp_string
                ))
                .unwrap();

            let creds = Credentials::new(smtp_email, smtp_password);
            let mailer: AsyncSmtpTransport<Tokio1Executor> = AsyncSmtpTransport::<Tokio1Executor>::relay(&smtp_host)
                .unwrap()
                .credentials(creds)
                .build();

            // Kirim secara Asynchronous
            match mailer.send(email_msg).await {
                Ok(_) => (
                    StatusCode::OK, // 200: Semuanya lancar
                    Json(ResponPesan {
                        status: "sukses".to_string(),
                        pesan: "Kode OTP berhasil dikirim ke email kamu! Silakan cek kotak masuk atau folder spam.".to_string(),
                    })
                ),
                Err(e) => (
                    StatusCode::INTERNAL_SERVER_ERROR, // 500: Server gagal kirim email
                    Json(ResponPesan {
                        status: "gagal".to_string(),
                        pesan: format!("Gagal mengirim email: {}", e),
                    })
                ),
            }
        },
        Ok(None) => (
            StatusCode::NOT_FOUND, // 404: Email tidak ketemu
            Json(ResponPesan { status: "gagal".to_string(), pesan: "Email tidak terdaftar di sistem!".to_string() })
        ),
        Err(_) => (
            StatusCode::INTERNAL_SERVER_ERROR, // 500: Error database
            Json(ResponPesan { status: "error".to_string(), pesan: "Terjadi kesalahan sistem.".to_string() })
        ),
    }
}

// =========================================================================
// WEBSOCKET & NOTIFIKASI HANDLERS
// =========================================================================

// Endpoint untuk menerima koneksi WebSocket dari Frontend
pub async fn ws_notifikasi(
    ws: WebSocketUpgrade,
    Extension(tx): Extension<tokio::sync::broadcast::Sender<String>>,
) -> Response {
    let rx = tx.subscribe();
    // Beritahu Axum untuk meng-upgrade koneksi HTTP biasa menjadi WebSocket
    ws.on_upgrade(move |socket| handle_socket(socket, rx))
}

// Menghandle aliran pesan untuk setiap client
async fn handle_socket(mut socket: WebSocket, mut rx: tokio::sync::broadcast::Receiver<String>) {
    // Terus tunggu pesan masuk dari channel internal kita
    while let Ok(msg) = rx.recv().await {
        // Jika ada pesan, teruskan ke Frontend
        // Perhatikan tambahan `.into()` untuk konversi String -> Utf8Bytes di Axum 0.8
        if socket.send(WsMessage::Text(msg.into())).await.is_err() {
            break; // Jika gagal (misal client sudah menutup tab browser), hentikan loop
        }
    }
}

// Endpoint untuk Tombol "Broadcast Notifikasi" di Dashboard DUI
#[utoipa::path(
    post,
    path = "/api/notifikasi/broadcast",
    request_body = InputBroadcastNotifikasi,
    responses((status = 200, description = "Broadcast berhasil dikirim", body = ResponPesan)),
    tag = "Dashboard",
    security(("jwt_auth" = []))
)]
pub async fn broadcast_notifikasi(
    Extension(tx): Extension<tokio::sync::broadcast::Sender<String>>,
    Json(payload): Json<InputBroadcastNotifikasi>,
) -> Json<ResponPesan> {
    
    let pesan_notif = serde_json::json!({ 
        "tipe": "broadcast", 
        "judul": payload.judul, 
        "deskripsi": payload.pesan,
        "target_role": ["all"] // Semua user akan mendapatkannya
    }).to_string();
    let _ = tx.send(pesan_notif);

    Json(ResponPesan { status: "sukses".to_string(), pesan: "Broadcast notifikasi berhasil dikirim!".to_string() })
}

// Fungsi Ubah Password dari menu Profil
#[utoipa::path(
    put,
    path = "/api/users/ubah-password",
    request_body = InputUbahPassword,
    responses(
        (status = 200, description = "Password berhasil diubah", body = ResponPesan),
        (status = 401, description = "Password lama salah", body = ResponPesan)
    ),
    tag = "Manajemen User",
    security(("jwt_auth" = []))
)]
pub async fn ubah_password(
    State(db): State<DatabaseConnection>,
    Extension(username_jwt): Extension<String>,
    Json(payload): Json<InputUbahPassword>,
) -> (StatusCode, Json<ResponPesan>) {
    
    let pencarian = user::Entity::find().filter(user::Column::Username.eq(username_jwt)).one(&db).await;

    match pencarian {
        Ok(Some(data_user)) => {
            // Cek apakah password lamanya benar
            if !verify(&payload.password_lama, &data_user.password).unwrap_or(false) {
                return (
                    StatusCode::UNAUTHORIZED,
                    Json(ResponPesan { status: "gagal".to_string(), pesan: "Password lama yang Anda masukkan salah.".to_string() })
                );
            }

            // Hash password baru dan simpan
            let password_baru_hash = hash(&payload.password_baru, DEFAULT_COST).unwrap();
            let mut data_aktif: user::ActiveModel = data_user.into();
            data_aktif.password = Set(password_baru_hash);
            let _ = data_aktif.update(&db).await;

            (StatusCode::OK, Json(ResponPesan { status: "sukses".to_string(), pesan: "Password berhasil diubah.".to_string() }))
        },
        _ => (
            StatusCode::NOT_FOUND, 
            Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string() })
        ),
    }
}

// 2. Fungsi Reset Password
#[utoipa::path(
    post,
    path = "/api/reset-password",
    request_body = InputResetPasswordEmail,
    responses(
        (status = 200, description = "Password berhasil di-reset", body = ResponPesan),
        (status = 400, description = "Kode OTP kadaluarsa atau belum melakukan request OTP", body = ResponPesan),
        (status = 401, description = "Kode OTP salah", body = ResponPesan),
        (status = 404, description = "Email tidak ditemukan", body = ResponPesan)
    ),
    tag = "Auth"
)]
pub async fn reset_password_email(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputResetPasswordEmail>,
) -> (StatusCode, Json<ResponPesan>) { // <-- Tipe kembalian ditingkatkan
    
    let pencarian = user::Entity::find().filter(user::Column::Email.eq(payload.email.clone())).one(&db).await;

    match pencarian {
        Ok(Some(data_user)) => {
            let waktu_sekarang = Utc::now().timestamp();

            if let (Some(otp_db), Some(kadaluarsa_db)) = (&data_user.otp_reset, data_user.otp_kadaluarsa) {
                if kadaluarsa_db < waktu_sekarang {
                    return (
                        StatusCode::BAD_REQUEST, // 400: OTP Kadaluarsa
                        Json(ResponPesan { status: "gagal".to_string(), pesan: "Kode OTP sudah kadaluarsa (lewat 15 menit).".to_string() })
                    );
                }

                if otp_db != &payload.otp {
                    return (
                        StatusCode::UNAUTHORIZED, // 401: Kredensial (OTP) Salah
                        Json(ResponPesan { status: "gagal".to_string(), pesan: "Kode OTP salah!".to_string() })
                    );
                }

                // Ganti password dan hanguskan OTP
                let hash_password = hash(&payload.password_baru, DEFAULT_COST).unwrap();
                let mut data_aktif: user::ActiveModel = data_user.into();
                data_aktif.password = Set(hash_password);
                data_aktif.otp_reset = Set(None);
                data_aktif.otp_kadaluarsa = Set(None);
                let _ = data_aktif.update(&db).await;

                (
                    StatusCode::OK, // 200: Berhasil
                    Json(ResponPesan { status: "sukses".to_string(), pesan: "Password berhasil di-reset! Silakan login.".to_string() })
                )
            } else {
                (
                    StatusCode::BAD_REQUEST, // 400: Belum minta OTP
                    Json(ResponPesan { status: "gagal".to_string(), pesan: "Kamu belum melakukan request OTP!".to_string() })
                )
            }
        },
        _ => (
            StatusCode::NOT_FOUND, // 404: Email tidak ada
            Json(ResponPesan { status: "gagal".to_string(), pesan: "Email tidak ditemukan.".to_string() })
        ),
    }
}

#[utoipa::path(
    post,
    path = "/api/kontak",
    request_body = InputKontak,
    responses(
        (status = 201, description = "Pesan berhasil terkirim dan disimpan", body = ResponPesan),
        (status = 400, description = "Data yang dikirim tidak lengkap", body = ResponPesan),
        (status = 500, description = "Gagal menyimpan pesan ke database", body = ResponPesan)
    ),
    tag = "Public"
)]
pub async fn simpan_kontak(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputKontak>,
) -> (StatusCode, Json<ResponPesan>) {
    
    // Siapkan model untuk disimpan
    let pesan_baru = kontak::ActiveModel {
        nama: Set(payload.nama),
        email: Set(payload.email),
        pesan: Set(payload.pesan),
        waktu_kirim: Set(Utc::now().naive_utc()), // Ambil waktu saat ini
        ..Default::default()
    };

    match pesan_baru.insert(&db).await {
        Ok(_) => (
            StatusCode::CREATED,
            Json(ResponPesan {
                status: "sukses".to_string(),
                pesan: "Terima kasih! Pesan Anda telah kami terima dan akan segera diproses.".to_string(),
            })
        ),
        Err(e) => (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ResponPesan {
                status: "error".to_string(),
                pesan: format!("Gagal mengirim pesan: {}", e),
            })
        ),
    }
}