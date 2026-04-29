use axum::{routing::{get, post}, Router, Json};
use serde::{Deserialize, Serialize};

// 1. Struktur Data Input (Dari Frontend ke Backend)
// Karena ini menerima data, kita pakai sihir Deserialize
#[derive(Deserialize)]
struct InputSetoran {
    id_wilayah: String,
    kategori: String,
    berat_kg: f32,
}

// 2. Struktur Data Balasan (Dari Backend ke Frontend)
// Karena ini mengirim data keluar, kita pakai sihir Serialize
#[derive(Serialize)]
struct ResponSetoran {
    status: String,
    pesan: String,
    estimasi_harga: f32,
}

#[tokio::main]
async fn main() {
    // 3. Daftarkan rute baru
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }))
        // Rute baru khusus untuk metode POST
        .route("/api/setoran", post(terima_setoran));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server SIM-TH berjalan di http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}

// 4. Logika Dapur (Handler)
// Fungsi ini otomatis mengekstrak JSON dari frontend ke dalam bentuk 'InputSetoran'
async fn terima_setoran(Json(payload): Json<InputSetoran>) -> Json<ResponSetoran> {
    
    // Anggap saja kita punya rumus harga
    let harga_per_kg = 4000.0;
    let total = payload.berat_kg * harga_per_kg;

    // Merangkai pesan balasan
    let pesan_balasan = format!(
        "Setoran {} dari {} seberat {} kg berhasil dicatat dapur!",
        payload.kategori, payload.id_wilayah, payload.berat_kg
    );

    // Bungkus ke dalam struktur respon
    let respon = ResponSetoran {
        status: "sukses".to_string(),
        pesan: pesan_balasan,
        estimasi_harga: total,
    };

    // Kembalikan ke frontend menjadi teks JSON murni
    Json(respon)
}