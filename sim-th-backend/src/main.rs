use axum::{routing::{get, post, delete, put}, Router, middleware};
use sea_orm::Database;
use std::env;
use tower_http::cors::{CorsLayer, Any};
use axum::http::{Method, header};
use utoipa::{
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
    Modify, OpenApi,
};
use utoipa_swagger_ui::SwaggerUi;

mod handlers;
mod entities;

// 1. Daftarkan semua fungsi Auth dan struct-nya di sini
#[derive(OpenApi)]
#[openapi(
    paths(
        // Modul Auth
        handlers::register,
        handlers::login,
        handlers::verify_2fa,
        handlers::minta_otp_email,
        handlers::reset_password_email,
        // Modul Manajemen User
        handlers::setup_totp,
        handlers::aktifkan_totp,
        handlers::lihat_user,    
        handlers::update_user,   
        handlers::hapus_user
    ),
    components(
        schemas(
            // Struct Untuk Auth
            handlers::InputRegister,
            handlers::InputLogin,
            handlers::InputVerify2FA,
            handlers::InputLupaPassword,
            handlers::InputResetPasswordEmail,
            handlers::InputAktifkanTOTP,
            handlers::ResponPesan,
            handlers::ResponLogin,
            // Struct Untuk Manajemen User
            handlers::InputUpdateUser,
            // Struct Respon Umum
            handlers::ResponPesan,
            handlers::ResponLogin
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "Auth", description = "Endpoint untuk Autentikasi (Register, Login, Lupa Password)"),
        (name = "Manajemen User", description = "Endpoint untuk pengaturan User dan 2FA")
    )
)]
struct ApiDoc;

// 2. Ini adalah konfigurasi agar ikon Gembok di Swagger berfungsi pakai token Bearer
struct SecurityAddon;

impl Modify for SecurityAddon {
    fn modify(&self, openapi: &mut utoipa::openapi::OpenApi) {
        if let Some(components) = openapi.components.as_mut() {
            components.add_security_scheme(
                "jwt_auth",
                SecurityScheme::Http(
                    HttpBuilder::new()
                        .scheme(HttpAuthScheme::Bearer)
                        .bearer_format("JWT")
                        .build(),
                ),
            )
        }
    }
}

#[tokio::main]
async fn main() {
    // Minta dotenvy membaca file .env yang ada di folder luar
    dotenvy::dotenv().ok();

    // Ambil URL rahasia dari dalam file .env
    let db_url = env::var("DATABASE_URL").expect("Aduh, DATABASE_URL tidak ditemukan di .env!");

    // Coba colokkan kabel koneksi ke PostgreSQL
    println!("Mencoba menyambungkan ke brankas data...");
    let db = Database::connect(&db_url).await.expect("Gagal menyambung ke database! Pastikan Podman nyala.");
    println!("✅ Berhasil tersambung ke PostgreSQL!");

    // Buat aturan CORS (Jembatan Lintas Domain)
    let jembatan_cors = CorsLayer::new()
        // Izinkan tamu dari alamat mana saja (nanti bisa diganti ke localhost:5173 spesifik kalau mau lebih ketat)
        .allow_origin(Any) 
        // Izinkan mereka membawa JWT dan format JSON
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        // Izinkan mereka melakukan aksi CRUD
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE]);
    
    // Buat wilayah
    let rute_wilayah = Router::new()
        .route("/", get(handlers::lihat_wilayah).post(handlers::tambah_wilayah))
        .route("/aktif", get(handlers::lihat_wilayah_aktif))
        .route("/{id}", put(handlers::update_wilayah).delete(handlers::hapus_wilayah))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Kategori
    let rute_kategori = Router::new()
        .route("/", get(handlers::lihat_kategori).post(handlers::tambah_kategori))
        .route("/{id}", put(handlers::update_kategori).delete(handlers::hapus_kategori))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    let rute_transaksi = Router::new()
        .route("/", get(handlers::lihat_transaksi).post(handlers::tambah_transaksi))
        .route("/{id}", delete(handlers::hapus_transaksi))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    let rute_tabungan = Router::new()
        .route("/", get(handlers::lihat_tabungan))
        .route("/tarik", post(handlers::tarik_saldo)) // Cukup GET saja, karena tabungan diisi otomatis!
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Dashboard
    let rute_dashboard = Router::new()
        .route("/", get(handlers::lihat_dashboard))
        .route("/{id}", get(handlers::lihat_dashboard_wilayah))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Manajemen User (BARU)
    let rute_user = Router::new()
        .route("/", get(handlers::lihat_user))
        .route("/{id}", put(handlers::update_user).delete(handlers::hapus_user))
        .route("/setup-totp", post(handlers::setup_totp))
        .route("/aktifkan-totp", post(handlers::aktifkan_totp))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Titipkan kunci brankas (db) ke dalam aplikasi (State)
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }))
        .route("/api/register", post(handlers::register))// Rute untuk registrasi user baru
        .route("/api/login", post(handlers::login)) // Rute untuk login
        .route("/api/lupa-password", post(handlers::minta_otp_email))
        .route("/api/reset-password", post(handlers::reset_password_email))
        .route("/api/verify-2fa", post(handlers::verify_2fa))
        .nest("/api/wilayah", rute_wilayah)
        .nest("/api/kategori", rute_kategori)
        .nest("/api/transaksi", rute_transaksi)
        .nest("/api/tabungan", rute_tabungan)
        .nest("/api/dashboard", rute_dashboard)
        .nest("/api/users", rute_user)
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(db) // <-- Kunci dititipkan di sini
        .layer(jembatan_cors); 

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("🚀 Server SIM-TH berjalan di http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}