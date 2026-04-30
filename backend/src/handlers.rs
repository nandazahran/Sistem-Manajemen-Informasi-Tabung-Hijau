use axum::extract::{Path, State};
use axum::Json;
use sea_orm::{DatabaseConnection, ActiveModelTrait, EntityTrait, Set}; // Tambahkan Set & ActiveModelTrait
use serde::{Deserialize, Serialize};

// Import cetakan tabel yang baru saja kita generate!
use crate::entity::setoran;

#[derive(Deserialize)]
pub struct InputSetoran {
    pub id_wilayah: String,
    pub kategori: String,
    pub berat_kg: f32,
}

#[derive(Serialize)]
pub struct ResponSetoran {
    pub status: String,
    pub pesan: String,
    pub estimasi_harga: f32,
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
pub async fn ambil_semua_setoran(
    State(db): State<DatabaseConnection>,
) -> Json<Vec<setoran::Model>> { // Mengembalikan sebuah list (Vector) berisi cetakan model setoran
    
    // Suruh SeaORM mencari (.find) dan mengambil semua (.all) data dari tabel
    let daftar_setoran = setoran::Entity::find().all(&db).await.unwrap_or_default();

    // Langsung bungkus hasilnya ke dalam format JSON dan kirim ke frontend
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