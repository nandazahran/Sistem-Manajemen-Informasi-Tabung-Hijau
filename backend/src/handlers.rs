use axum::{
    extract::{Path, State, Query,Json,Request},
    http::{header, StatusCode, HeaderMap},
    middleware::Next,
    response::Response,
};
use sea_orm::{DatabaseConnection, ActiveModelTrait, EntityTrait, Set, QueryFilter, ColumnTrait, FromQueryResult, JoinType, QuerySelect, RelationTrait, ModelTrait};
use serde::{Deserialize, Serialize};
use bcrypt::{hash, verify, DEFAULT_COST}; // Tambahkan alat bcrypt
use jsonwebtoken::{encode, EncodingKey, Header, decode, DecodingKey, Validation}; // Alat pembuat JWT
use chrono::{Utc, Duration}; // Jam digital untuk masa berlaku token

use crate::entities::{user,wilayah,kategori_sampah, transaksi_sampah, tabungan_sampah};

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

#[derive(Deserialize)]
pub struct InputUpdateUser {
    pub nama: String,
}

// Struct untuk menerima data dari frontend
#[derive(Deserialize)]
pub struct InputKategori {
    pub nama_kategori: String,
    pub harga_per_kg: i32, 
}

// 2. Struct untuk menerima input (Perhatikan kita pakai berat_gram)
#[derive(Deserialize)]
pub struct InputTransaksi {
    pub kategori_id: i32,
    pub wilayah_id: i32,
    pub berat_gram: i32, 
}

// Struct untuk menerima request penarikan saldo
#[derive(Deserialize)]
pub struct InputTarik {
    pub wilayah_id: i32,
    pub nominal: i32,
}

// Cetakan untuk data Transaksi yang sudah digabung
#[derive(FromQueryResult, Serialize)]
pub struct TransaksiLengkap {
    pub id: i32,
    pub berat: i32,
    pub total_nilai: i32,
    pub status: String,
    pub nama_kategori: String, // Diambil dari tabel kategori
    pub nama_wilayah: String,  // Diambil dari tabel wilayah
    pub nama_petugas: String,  // Diambil dari tabel user
}

// Ganti tipe data i32 menjadi Option<i64> dan i64
#[derive(FromQueryResult, Serialize)]
pub struct RekapDashboard {
    pub total_berat_gram: Option<i64>, // Pakai Option karena SUM bisa NULL kalau tabel kosong
    pub total_rupiah: Option<i64>,     // Postgres mengembalikan INT8 (i64) untuk SUM
    pub jumlah_transaksi: i64,         // Postgres mengembalikan INT8 (i64) untuk COUNT
}

// Cetakan untuk data Tabungan yang sudah digabung
#[derive(FromQueryResult, Serialize)]
pub struct TabunganLengkap {
    pub id: i32,
    pub saldo: i32,
    pub status: String,
    pub nama_wilayah: String, // Diambil dari tabel wilayah
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

// 1. Fungsi Lihat Semua User (READ)
pub async fn lihat_user(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    let pencarian = user::Entity::find().all(&db).await;

    match pencarian {
        Ok(daftar_user) => {
            // Kita saring datanya agar kolom 'password' TIDAK ikut terkirim ke frontend!
            let data_aman: Vec<_> = daftar_user.into_iter().map(|u| {
                serde_json::json!({
                    "id": u.id,
                    "username": u.username,
                    "nama": u.nama
                })
            }).collect();

            Json(serde_json::json!({
                "status": "sukses",
                "data": data_aman
            }))
        },
        Err(e) => Json(serde_json::json!({
            "status": "error",
            "pesan": format!("Gagal mengambil data user: {}", e)
        })),
    }
}

// 2. Fungsi Update User (PUT)
pub async fn update_user(
    State(db): State<DatabaseConnection>,
    Path(user_id): Path<i32>,
    Json(payload): Json<InputUpdateUser>,
) -> Json<ResponPesan> {
    let pencarian = user::Entity::find_by_id(user_id).one(&db).await;

    match pencarian {
        Ok(Some(data_lama)) => {
            let mut data_aktif: user::ActiveModel = data_lama.into();
            data_aktif.nama = Set(payload.nama.clone()); // Cukup nama yang diizinkan diubah

            match data_aktif.update(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Data admin ID {} berhasil diupdate menjadi '{}'.", user_id, payload.nama),
                }),
                Err(e) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Gagal mengupdate user: {}", e),
                })
            }
        },
        Ok(None) => Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string() }),
        Err(e) => Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
    }
}

// 3. Fungsi Hapus User (DELETE)
pub async fn hapus_user(
    State(db): State<DatabaseConnection>,
    Path(user_id): Path<i32>,
) -> Json<ResponPesan> {
    let pencarian = user::Entity::find_by_id(user_id).one(&db).await;

    match pencarian {
        Ok(Some(data)) => {
            let username_dihapus = data.username.clone();
            match data.delete(&db).await {
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Akses admin untuk '{}' berhasil dicabut (dihapus).", username_dihapus),
                }),
                Err(_) => Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: "Gagal! User ini tidak bisa dihapus karena sudah pernah mencatat transaksi. Aksesnya harus dibiarkan untuk jejak audit.".to_string(),
                })
            }
        },
        Ok(None) => Json(ResponPesan { status: "gagal".to_string(), pesan: "User tidak ditemukan.".to_string() }),
        Err(e) => Json(ResponPesan { status: "error".to_string(), pesan: e.to_string() }),
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

                let kunci_rahasia = std::env::var("JWT_SECRET")
                    .expect("Waduh, JWT_SECRET belum diatur di file .env!")
                    .into_bytes();

                let token_jwt = encode(
                    &Header::default(),
                    &klaim,
                    &EncodingKey::from_secret(&kunci_rahasia),
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
    let kunci_rahasia = std::env::var("JWT_SECRET")
        .expect("Waduh, JWT_SECRET belum diatur di file .env!")
        .into_bytes();

    // 4. Alat Scanner: Periksa keaslian KTP menggunakan kunci rahasia
    match decode::<KlaimToken>(
        token_asli,
        &DecodingKey::from_secret(&kunci_rahasia),
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

// 1. Fungsi Update Wilayah (PUT)
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
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Wilayah ID {} berhasil diupdate. Nama: '{}', Status: '{}'.", wilayah_id, payload.nama, payload.status),
                }),
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

// Fungsi Update Kategori Sampah (Misal untuk mengubah harga)
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
pub async fn tambah_transaksi(
    State(db): State<DatabaseConnection>,
    headers: HeaderMap, // Tangkap header untuk membaca JWT
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

    // --- TAHAP 1.5: GEMBOK KEAMANAN (CEK STATUS WILAYAH) ---
    let pencarian_wilayah = wilayah::Entity::find_by_id(payload.wilayah_id).one(&db).await;
    match pencarian_wilayah {
        Ok(Some(w)) => {
            // Kalau ketemu, tapi statusnya bukan Aktif, tolak setorannya!
            if w.status != "Aktif" {
                return Json(ResponPesan {
                    status: "gagal".to_string(),
                    pesan: format!("Setoran ditolak! Wilayah '{}' saat ini berstatus Nonaktif.", w.nama),
                });
            }
        },
        Ok(None) => return Json(ResponPesan {
            status: "gagal".to_string(),
            pesan: format!("Wilayah ID {} tidak ditemukan di sistem!", payload.wilayah_id),
        }),
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

    // --- TAHAP 4: SIMPAN KE BRANKAS ---
    let transaksi_baru = transaksi_sampah::ActiveModel {
        berat: Set(payload.berat_gram),
        total_nilai: Set(kalkulasi_total_nilai),
        status: Set("Selesai".to_string()),
        kategori_id: Set(payload.kategori_id),
        wilayah_id: Set(payload.wilayah_id),
        input_by: Set(petugas.id), 
        ..Default::default()
    };

    match transaksi_baru.insert(&db).await {
    Ok(_) => {
        // --- TAHAP 5: OTOMATISASI SALDO TABUNGAN WILAYAH ---
        let pencarian_dompet = tabungan_sampah::Entity::find()
            .filter(tabungan_sampah::Column::WilayahId.eq(payload.wilayah_id))
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
                    wilayah_id: Set(payload.wilayah_id),
                    ..Default::default()
                };
                let _ = dompet_baru.insert(&db).await;
            }
        }

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
pub async fn lihat_transaksi(
    State(db): State<DatabaseConnection>,
) -> Json<serde_json::Value> {
    
    let query_transaksi = transaksi_sampah::Entity::find()
        // Pilih kolom tambahan yang mau dicomot dari tabel tetangga
        .column_as(kategori_sampah::Column::NamaKategori, "nama_kategori")
        .column_as(wilayah::Column::Nama, "nama_wilayah")
        .column_as(user::Column::Nama, "nama_petugas")
        // Lakukan penggabungan (Inner Join) berdasarkan Foreign Key
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::KategoriSampah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::Wilayah.def())
        .join(JoinType::InnerJoin, transaksi_sampah::Relation::User.def())
        // Tuangkan hasilnya ke dalam cetakan JSON yang kita buat tadi
        .into_model::<TransaksiLengkap>()
        .all(&db)
        .await;

    match query_transaksi {
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

// 2. Fungsi Lihat Tabungan (Membaca 2 Tabel)
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

// Fungsi Hapus Transaksi (Dilengkapi dengan Auto-Kurang Saldo)
pub async fn hapus_transaksi(
    State(db): State<DatabaseConnection>,
    Path(transaksi_id): Path<i32>, // Mengambil ID dari URL
) -> Json<ResponPesan> {
    
    // 1. Cari data transaksi yang mau dihapus
    let pencarian_transaksi = transaksi_sampah::Entity::find_by_id(transaksi_id).one(&db).await;

    match pencarian_transaksi {
        Ok(Some(data_trx)) => {
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
                Ok(_) => Json(ResponPesan {
                    status: "sukses".to_string(),
                    pesan: format!("Transaksi ID {} berhasil dihapus dan saldo tabungan otomatis ditarik kembali sebesar Rp {}.", transaksi_id, nilai_yang_dihapus),
                }),
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
pub async fn tarik_saldo(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputTarik>,
) -> Json<ResponPesan> {
    
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