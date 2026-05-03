use axum::{routing::{get, post, delete, put}, Router, middleware};
use sea_orm::Database;
use std::env;
use tower_http::cors::{CorsLayer, Any};
use axum::http::{Method, header};

mod handlers;
mod entities;

#[tokio::main]
async fn main() {
    // 1. Minta dotenvy membaca file .env yang ada di folder luar
    dotenvy::dotenv().ok();

    // 2. Ambil URL rahasia dari dalam file .env
    let db_url = env::var("DATABASE_URL").expect("Aduh, DATABASE_URL tidak ditemukan di .env!");

    // 3. Coba colokkan kabel koneksi ke PostgreSQL
    println!("Mencoba menyambungkan ke brankas data...");
    let db = Database::connect(&db_url).await.expect("Gagal menyambung ke database! Pastikan Podman nyala.");
    println!("✅ Berhasil tersambung ke PostgreSQL!");

    // 1. Buat aturan CORS (Jembatan Lintas Domain)
    let jembatan_cors = CorsLayer::new()
        // Izinkan tamu dari alamat mana saja (nanti bisa diganti ke localhost:5173 spesifik kalau mau lebih ketat)
        .allow_origin(Any) 
        // Izinkan mereka membawa JWT dan format JSON
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        // Izinkan mereka melakukan aksi CRUD
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE]);
    
    // 2. Buat wilayah khusus yang DIJAGA SATPAM
    let rute_wilayah = Router::new()
        //.route("/", get(handlers::ambil_semua_setoran).post(handlers::terima_setoran))
        //.route("/{id_target}", delete(handlers::hapus_setoran).put(handlers::update_setoran))
        // Pasang satpam di sini! Semua rute di dalam blok ini akan diperiksa.
        .route("/", get(handlers::lihat_wilayah).post(handlers::tambah_wilayah))
        .route_layer(middleware::from_fn(handlers::satpam_jwt));

    // 2. Rute Kategori
    let rute_kategori = Router::new()
        .route("/", get(handlers::lihat_kategori).post(handlers::tambah_kategori))
        .route("/{id}", put(handlers::update_kategori))
        .route_layer(middleware::from_fn(handlers::satpam_jwt));

    let rute_transaksi = Router::new()
        .route("/", get(handlers::lihat_transaksi).post(handlers::tambah_transaksi))
        .route("/{id}", delete(handlers::hapus_transaksi))
        .route_layer(middleware::from_fn(handlers::satpam_jwt));

    let rute_tabungan = Router::new()
        .route("/", get(handlers::lihat_tabungan))
        .route("/tarik", post(handlers::tarik_saldo)) // Cukup GET saja, karena tabungan diisi otomatis!
        .route_layer(middleware::from_fn(handlers::satpam_jwt));

    // 4. Titipkan kunci brankas (db) ke dalam aplikasi (State)
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }))
        .route("/api/register", post(handlers::register))// Rute untuk registrasi user baru
        .route("/api/login", post(handlers::login)) // Rute untuk login
        .nest("/api/wilayah", rute_wilayah)
        .nest("/api/kategori", rute_kategori)
        .nest("/api/transaksi", rute_transaksi)
        .nest("/api/tabungan", rute_tabungan)
        .with_state(db) // <-- Kunci dititipkan di sini
        .layer(jembatan_cors); 

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("🚀 Server SIM-TH berjalan di http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}