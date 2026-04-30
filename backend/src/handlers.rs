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

// Import cetakan tabel yang baru saja kita generate!
use crate::entity::setoran;
use crate::entity::users; // Panggil cetakan tabel users

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

#[derive(Deserialize)]
pub struct InputUser {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct ResponPesan {
    pub status: String,
    pub pesan: String,
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

pub async fn terima_setoran(
    // Hapus tanda garis bawah pada _db, karena sekarang kita akan paksa dia bekerja!
    State(db): State<DatabaseConnection>, 
    Json(payload): Json<InputSetoran>
) -> Json<ResponSetoran> {
    
    let harga_per_kg = 4000.0;
    let total = payload.berat_kg * harga_per_kg;

    // 1. Bungkus data dari frontend ke dalam format pengiriman SeaORM (ActiveModel)
    // Kita pakai Set() untuk memberi tahu SeaORM: "Tolong ubah kolom ini"
    let data_baru = setoran::ActiveModel {
        id_wilayah: Set(payload.id_wilayah.clone()),
        kategori: Set(payload.kategori.clone()),
        berat_kg: Set(payload.berat_kg),
        estimasi_harga: Set(total),
        ..Default::default() // Sisa kolomnya (seperti ID) biarkan database yang isi otomatis
    };

    // 2. Tembakkan ke dalam brankas PostgreSQL!
    match data_baru.insert(&db).await {
        Ok(hasil) => {
            // Kalau sukses, kita ambil ID yang baru saja dibuat oleh database
            let pesan_balasan = format!(
                "Sukses! Setoran {} seberat {} kg berhasil dicatat dengan ID Transaksi: {}",
                hasil.kategori, hasil.berat_kg, hasil.id
            );

            Json(ResponSetoran {
                status: "sukses".to_string(),
                pesan: pesan_balasan,
                estimasi_harga: total,
            })
        },
        Err(e) => {
            // Kalau gagal (misal koneksi putus), balas pesan error
            Json(ResponSetoran {
                status: "gagal".to_string(),
                pesan: format!("Waduh, gagal menyimpan ke database: {}", e),
                estimasi_harga: 0.0,
            })
        }
    }
}
// Ini fungsi baru untuk mengambil semua data
// Tambahkan Query(filter) sebagai parameter baru
pub async fn ambil_semua_setoran(
    State(db): State<DatabaseConnection>,
    Query(filter): Query<FilterSetoran>, 
) -> Json<Vec<setoran::Model>> {
    
    // 1. Siapkan query dasar: "Cari data di tabel setoran"
    let mut pencarian = setoran::Entity::find();

    // 2. Kalau di URL ada ?id_wilayah=..., tambahkan filter wilayah (sama persis)
    if let Some(wilayah) = filter.id_wilayah {
        pencarian = pencarian.filter(setoran::Column::IdWilayah.eq(wilayah));
    }

    // 3. Kalau di URL ada &kategori=..., tambahkan filter kategori
    if let Some(kat) = filter.kategori {
        // Pakai .contains() biar fleksibel, misalnya cari "Plastik" bakal dapat "Plastik PET"
        pencarian = pencarian.filter(setoran::Column::Kategori.contains(kat));
    }

    // 4. Eksekusi query finalnya ke brankas
    let daftar_setoran = pencarian.all(&db).await.unwrap_or_default();

    Json(daftar_setoran)
}

// Fungsi untuk menghapus data berdasarkan ID
pub async fn hapus_setoran(
    State(db): State<DatabaseConnection>,
    Path(id_target): Path<i32>, // Mengambil angka ID dari URL
) -> Json<ResponSetoran> { // Kita pinjam format ResponSetoran yang sudah ada
    
    // Suruh SeaORM mencari ID tersebut dan langsung hapus!
    match setoran::Entity::delete_by_id(id_target).exec(&db).await {
        Ok(hasil) => {
            // Cek apakah ada baris yang benar-benar terhapus
            if hasil.rows_affected > 0 {
                Json(ResponSetoran {
                    status: "sukses".to_string(),
                    pesan: format!("Beres! Setoran dengan ID {} berhasil dimusnahkan dari brankas.", id_target),
                    estimasi_harga: 0.0,
                })
            } else {
                // Kalau ID-nya tidak ada di database
                Json(ResponSetoran {
                    status: "gagal".to_string(),
                    pesan: format!("Waduh, data dengan ID {} tidak ditemukan.", id_target),
                    estimasi_harga: 0.0,
                })
            }
        },
        Err(e) => {
            Json(ResponSetoran {
                status: "error".to_string(),
                pesan: format!("Sistem bermasalah saat menghapus data: {}", e),
                estimasi_harga: 0.0,
            })
        }
    }
}

// Fungsi untuk mengubah data (Update)
pub async fn update_setoran(
    State(db): State<DatabaseConnection>,
    Path(id_target): Path<i32>,       // 1. Ambil ID dari URL
    Json(payload): Json<InputSetoran>, // 2. Ambil data perubahannya dari Body JSON
) -> Json<ResponSetoran> {

    // 3. Cari data lamanya di dalam database
    match setoran::Entity::find_by_id(id_target).one(&db).await {
        Ok(Some(data_lama)) => {
            // Kalau datanya KETEMU, ubah formatnya jadi "bisa diedit" (ActiveModel)
            let mut data_edit: setoran::ActiveModel = data_lama.into();

            // Hitung estimasi harga baru berdasarkan berat yang baru
            let harga_per_kg = 4000.0;
            let total_baru = payload.berat_kg * harga_per_kg;

            // Masukkan data baru dari frontend untuk menimpa data lama
            data_edit.id_wilayah = Set(payload.id_wilayah.clone());
            data_edit.kategori = Set(payload.kategori.clone());
            data_edit.berat_kg = Set(payload.berat_kg);
            data_edit.estimasi_harga = Set(total_baru);

            // 4. Simpan kembali ke brankas!
            match data_edit.update(&db).await {
                Ok(_) => {
                    Json(ResponSetoran {
                        status: "sukses".to_string(),
                        pesan: format!("Sip! Data setoran ID {} berhasil diperbarui.", id_target),
                        estimasi_harga: total_baru,
                    })
                },
                Err(e) => {
                    Json(ResponSetoran {
                        status: "error".to_string(),
                        pesan: format!("Gagal menyimpan pembaruan ke database: {}", e),
                        estimasi_harga: 0.0,
                    })
                }
            }
        },
        Ok(None) => {
            // Kalau pencarian sukses, TAPI datanya kosong/tidak ada
            Json(ResponSetoran {
                status: "gagal".to_string(),
                pesan: format!("Tidak bisa diedit karena data dengan ID {} tidak ditemukan.", id_target),
                estimasi_harga: 0.0,
            })
        },
        Err(e) => {
            // Kalau terjadi masalah koneksi saat mencari
            Json(ResponSetoran {
                status: "error".to_string(),
                pesan: format!("Sistem bermasalah saat mencari data: {}", e),
                estimasi_harga: 0.0,
            })
        }
    }
}

pub async fn register(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputUser>,
) -> Json<ResponPesan> {

    // 1. Acak password menggunakan algoritma bcrypt!
    // DEFAULT_COST menentukan seberapa rumit pengacakannya (biasanya bernilai 12)
    let password_acak = match hash(&payload.password, DEFAULT_COST) {
        Ok(hasil_hash) => hasil_hash,
        Err(_) => return Json(ResponPesan {
            status: "error".to_string(),
            pesan: "Sistem bermasalah saat mengamankan password.".to_string(),
        }),
    };

    // 2. Bungkus data untuk dimasukkan ke tabel users
    let user_baru = users::ActiveModel {
        username: Set(payload.username.clone()),
        password: Set(password_acak), // Masukkan password yang SUDAH DIACAK
        ..Default::default()
    };

    // 3. Tembakkan ke database
    match user_baru.insert(&db).await {
        Ok(_) => Json(ResponPesan {
            status: "sukses".to_string(),
            pesan: format!("Beres! Akun '{}' berhasil didaftarkan.", payload.username),
        }),
        Err(_) => Json(ResponPesan {
            status: "gagal".to_string(),
            // Error biasanya terjadi karena username sudah ada (karena aturan unique_key tadi)
            pesan: "Gagal mendaftar. Username mungkin sudah dipakai orang lain.".to_string(),
        }),
    }
}

pub async fn login(
    State(db): State<DatabaseConnection>,
    Json(payload): Json<InputUser>,
) -> Json<ResponLogin> {

    let pencarian_user = users::Entity::find()
        .filter(users::Column::Username.eq(payload.username.clone()))
        .one(&db)
        .await;

    match pencarian_user {
        Ok(Some(data_user)) => {
            let password_cocok = verify(&payload.password, &data_user.password).unwrap_or(false);

            if password_cocok {
                // --- PROSES PEMBUATAN KTP DIGITAL (JWT) MULAI DARI SINI ---
                
                // 1. Tentukan masa berlaku (misal: 24 jam dari sekarang)
                let waktu_hangus = Utc::now()
                    .checked_add_signed(Duration::hours(24))
                    .expect("Gagal menghitung waktu")
                    .timestamp() as usize;

                // 2. Isi data KTP-nya
                let klaim = KlaimToken {
                    sub: data_user.username.clone(),
                    exp: waktu_hangus,
                };

                // 3. Stempel resmi KTP menggunakan "Kunci Rahasia"
                // CATATAN: Di dunia nyata, kunci ini ditaruh di file .env supaya tidak bocor!
                let kunci_rahasia = b"kunci_rahasia_sim_th_super_aman"; 

                // 4. Cetak KTP-nya!
                let token_jwt = encode(
                    &Header::default(),
                    &klaim,
                    &EncodingKey::from_secret(kunci_rahasia),
                ).unwrap();

                Json(ResponLogin {
                    status: "sukses".to_string(),
                    pesan: format!("Selamat datang, {}! Ini token aksesmu.", payload.username),
                    token: Some(token_jwt), // Kirim token-nya ke frontend
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