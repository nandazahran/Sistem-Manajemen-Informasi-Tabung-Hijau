use axum::{extract::State, Json};
use sea_orm::DatabaseConnection;
use serde::{Deserialize, Serialize};

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

// Tambahkan State(db) di dalam kurung parameter untuk menerima koneksi database
pub async fn terima_setoran(
    State(_db): State<DatabaseConnection>, // Pake garis bawah _db karena belum dipakai
    Json(payload): Json<InputSetoran>
) -> Json<ResponSetoran> {
    
    let harga_per_kg = 4000.0;
    let total = payload.berat_kg * harga_per_kg;

    let pesan_balasan = format!(
        "Setoran {} dari {} seberat {} kg berhasil dicatat dapur!",
        payload.kategori, payload.id_wilayah, payload.berat_kg
    );

    let respon = ResponSetoran {
        status: "sukses".to_string(),
        pesan: pesan_balasan,
        estimasi_harga: total,
    };

    Json(respon)
}