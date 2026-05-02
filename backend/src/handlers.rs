use axum::extract::{Path, State, Query};
use axum::Json;
use axum::{
    extract::Request,
    http::{header, StatusCode},
    middleware::Next,
    response::Response,
};
use sea_orm::{DatabaseConnection, ActiveModelTrait, EntityTrait, Set, QueryFilter, ColumnTrait}; // Tambahkan Set & ActiveModelTrait
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify, DEFAULT_COST}; // Tambahkan alat bcrypt
use jsonwebtoken::{encode, EncodingKey, Header, decode, DecodingKey, Validation}; // Alat pembuat JWT
use chrono::{Utc, Duration}; // Jam digital untuk masa berlaku token

use crate::entities::{user,wilayah,kategori_sampah};

#[derive(Deserialize)]
pub struct InputSetoran {
    pub id_wilayah: String,
    pub kategori: String,
    pub berat_kg: f32,
}

#[derive(Deserialize)]
pub struct FilterSetoran {
    pub id_wilayah: Option<String>,
    pub kategori: Option<String>,
}

#[derive(Serialize)]
pub struct ResponSetoran {
    pub status: String,
    pub pesan: String,
    pub estimasi_harga: f32,
}

// 1. Struct khusus untuk menerima data Register
#[derive(Deserialize)]
pub struct InputRegister {
    pub username: String,
    pub password: String,
    pub email: String,
    pub nama: String,
    pub role: String, // Nanti diisi: "Admin", "BEMWilayah", atau "DUI"
    pub wilayah_id: Option<i32>, // Pakai Option karena Admin/DUI tidak punya wilayah
}

// 2. Struct khusus untuk menerima data Login
#[derive(Deserialize)]
pub struct InputLogin {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct ResponPesan {
    pub status: String,
    pub pesan: String,
}

// Struct untuk menerima data dari frontend
#[derive(Deserialize)]
pub struct InputWilayah {
    pub nama: String,
    pub status: String,
}

// Ini adalah isi dari KTP Digital-nya
#[derive(Serialize, Deserialize)]
pub struct KlaimToken {
    pub sub: String, // sub = subject (siapa pemilik KTP ini)
    pub exp: usize,  // exp = expiration (kapan KTP ini hangus)
}

// Balasan khusus untuk fitur Login
#[derive(Serialize)]
pub struct ResponLogin {
    pub status: String,
    pub pesan: String,
    pub token: Option<String>, // Option karena kalau gagal login, token-nya kosong (None)
}

// Struct untuk menerima data dari frontend
#[derive(Deserialize)]
pub struct InputKategori {
    pub nama_kategori: String,
    pub harga_per_kg: i32, 
}

// 3. Fungsi Register yang sudah di-upgrade
pub async fn register(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputRegister>, // Gunakan InputRegister
) -> Json<ResponPesan> {

    let password_acak = match hash(&payload.password, DEFAULT_COST) {
        Ok(hasil_hash) => hasil_hash,
        Err(_) => return Json(ResponPesan {
            status: "error".to_string(),
            pesan: "Sistem bermasalah saat mengamankan password.".to_string(),
        }),
    };

    // Bungkus data menggunakan user::ActiveModel yang baru
    let user_baru = user::ActiveModel {
        username: Set(payload.username.clone()),
        email: Set(payload.email.clone()),
        password: Set(password_acak),
        nama: Set(payload.nama.clone()),
        role: Set(payload.role.clone()),
        status: Set("Aktif".to_string()), // Otomatis aktif saat mendaftar
        wilayah_id: Set(payload.wilayah_id),
        ..Default::default()
    };

    match user_baru.insert(&db).await {
        Ok(_) => Json(ResponPesan {
            status: "sukses".to_string(),
            pesan: format!("Beres! Akun '{}' berhasil didaftarkan sebagai {}.", payload.username, payload.role),
        }),
        Err(e) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: format!("Gagal mendaftar: Email atau Username mungkin sudah dipakai. Detail: {}", e),
        }),
    }
}

// 4. Fungsi Login yang sudah di-upgrade
pub async fn login(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputLogin>, // Gunakan InputLogin
) -> Json<ResponLogin> {

    // Gunakan user::Entity dari folder entities yang baru
    let pencarian_user = user::Entity::find()
        .filter(user::Column::Username.eq(payload.username.clone()))
        .one(&db)
        .await;

    match pencarian_user {
        Ok(Some(data_user)) => {
            let password_cocok = verify(&payload.password, &data_user.password).unwrap_or(false);

            if password_cocok {
                // --- PROSES JWT TETAP SAMA ---
                let waktu_hangus = Utc::now()
                    .checked_add_signed(Duration::hours(24))
                    .expect("Gagal menghitung waktu")
                    .timestamp() as usize;

                let klaim = KlaimToken {
                    sub: data_user.username.clone(),
                    exp: waktu_hangus,
                };

                let kunci_rahasia = b"kunci_rahasia_sim_th_super_aman"; 

                let token_jwt = encode(
                    &Header::default(),
                    &klaim,
                    &EncodingKey::from_secret(kunci_rahasia),
                ).unwrap();

                Json(ResponLogin {
                    status: "sukses".to_string(),
                    pesan: format!("Selamat datang, {}!", payload.username),
                    token: Some(token_jwt),
                })
            } else {
                Json(ResponLogin {
                    status: "gagal".to_string(),
                    pesan: "Waduh, password yang kamu masukkan salah.".to_string(),
                    token: None,
                })
            }
        },
        Ok(None) => {
            Json(ResponLogin {
                status: "gagal".to_string(),
                pesan: "Akun tidak ditemukan. Silakan daftar terlebih dahulu.".to_string(),
                token: None,
            })
        },
        Err(_) => {
            Json(ResponLogin {
                status: "error".to_string(),
                pesan: "Sistem bermasalah saat mencari data user.".to_string(),
                token: None,
            })
        }
    }
}

// Fungsi Satpam Penjaga Pintu (Middleware)
pub async fn satpam_jwt(
    req: Request, // Tangkap tamu yang datang
    next: Next,   // Pintu menuju fungsi CRUD
) -> Result<Response, (StatusCode, Json<ResponPesan>)> {
    
    // 1. Cek apakah tamu tersebut menempelkan KTP-nya di kepala (Header) suratnya
    let header_auth = req.headers().get(header::AUTHORIZATION).and_then(|h| h.to_str().ok());

    let token_lengkap = match header_auth {
        Some(isi_header) => isi_header,
        None => return Err((
            StatusCode::UNAUTHORIZED, // Kode 401: Tidak punya izin
            Json(ResponPesan { 
                status: "gagal".to_string(), 
                pesan: "Akses ditolak! Kamu tidak membawa KTP Digital (Token JWT).".to_string() 
            })
        )),
    };

    // 2. Sesuai standar API, token harus diawali dengan kata "Bearer "
    if !token_lengkap.starts_with("Bearer ") {
        return Err((
            StatusCode::UNAUTHORIZED,
            Json(ResponPesan { 
                status: "gagal".to_string(), 
                pesan: "Format token salah! Harus diawali dengan 'Bearer '.".to_string() 
            })
        ));
    }

    // 3. Potong 7 huruf pertama ("Bearer ") untuk mengambil kode acaknya saja
    let token_asli = &token_lengkap[7..];
    
    // Harus sama persis dengan kunci saat login tadi!
    let kunci_rahasia = b"kunci_rahasia_sim_th_super_aman"; 

    // 4. Alat Scanner: Periksa keaslian KTP menggunakan kunci rahasia
    match decode::<KlaimToken>(
        token_asli,
        &DecodingKey::from_secret(kunci_rahasia),
        &Validation::default(),
    ) {
        Ok(_data_ktp) => {
            // Kalau KTP asli dan belum hangus (expired), bukakan pintu!
            Ok(next.run(req).await)
        }
        Err(_) => {
            // Kalau KTP palsu hasil editan orang iseng, atau waktunya sudah habis
            Err((
                StatusCode::UNAUTHORIZED,
                Json(ResponPesan { 
                    status: "gagal".to_string(), 
                    pesan: "Token JWT palsu atau sudah kadaluarsa! Silakan login ulang.".to_string() 
                })
            ))
        }
    }
}

// 1. Fungsi Tambah Wilayah
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
        Ok(_) => Json(ResponPesan {
            status: "sukses".to_string(),
            pesan: format!("Wilayah '{}' berhasil ditambahkan ke sistem.", payload.nama),
        }),
        Err(_) => Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: "Gagal menambahkan wilayah. Nama wilayah mungkin sudah ada.".to_string(),
        }),
    }
}

// 2. Fungsi Lihat Semua Wilayah
pub async fn lihat_wilayah(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    
    let daftar_wilayah = wilayah::Entity::find().all(&db).await;

    match daftar_wilayah {
        Ok(data) => Json(serde_json::json!({
            "status": "sukses",
            "data": data
        })),
        Err(_) => Json(serde_json::json!({
            "status": "error",
            "pesan": "Gagal mengambil data wilayah"
        })),
    }
}

// 1. Fungsi Tambah Kategori
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