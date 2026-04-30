use axum::{routing::{get, post, delete, put}, Router, middleware};
use sea_orm::Database;
use std::env;

mod handlers;
mod entity;

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

    // 1. Buat wilayah khusus yang DIJAGA SATPAM
    let rute_setoran = Router::new()
        .route("/", get(handlers::ambil_semua_setoran).post(handlers::terima_setoran))
        .route("/{id_target}", delete(handlers::hapus_setoran).put(handlers::update_setoran))
        // Pasang satpam di sini! Semua rute di dalam blok ini akan diperiksa.
        .route_layer(middleware::from_fn(handlers::satpam_jwt));

    // 4. Titipkan kunci brankas (db) ke dalam aplikasi (State)
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }))
        .route("/api/register", post(handlers::register))// Rute untuk registrasi user baru
        .route("/api/login", post(handlers::login)) // Rute untuk login
        .nest("/api/setoran", rute_setoran)
        .with_state(db); // <-- Kunci dititipkan di sini

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("🚀 Server SIM-TH berjalan di http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}