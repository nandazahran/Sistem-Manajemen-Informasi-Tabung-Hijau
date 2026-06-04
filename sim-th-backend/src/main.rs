use axum::Extension;
use axum::http::{Method, header};
use axum::{
    Router, middleware,
    routing::{get, post, put},
};
use migration::{Migrator, MigratorTrait};
use sea_orm::Database;
use std::env;
use tower_http::cors::{Any, CorsLayer};
use utoipa::{
    Modify, OpenApi,
    openapi::security::{HttpAuthScheme, HttpBuilder, SecurityScheme},
};
use utoipa_swagger_ui::SwaggerUi;

mod entities;
mod handlers;

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
        handlers::hapus_user,
        handlers::simpan_kontak,
        handlers::ubah_password,
        // Modul Wilayah
        handlers::tambah_wilayah,
        handlers::lihat_wilayah,
        handlers::update_wilayah,
        handlers::hapus_wilayah,
        handlers::lihat_wilayah_aktif,
        // Modul Kategori
        handlers::tambah_kategori,
        handlers::lihat_kategori,
        handlers::update_kategori,
        handlers::hapus_kategori,
        // Modul Transaksi
        handlers::tambah_transaksi,
        handlers::lihat_transaksi,
        handlers::export_transaksi,
        handlers::update_transaksi,
        handlers::hapus_transaksi,
        // Modul Tabungan
        handlers::lihat_tabungan,
        handlers::tarik_saldo,
        // Modul Dashboard
        handlers::lihat_dashboard,
        handlers::lihat_dashboard_wilayah,
        handlers::lihat_leaderboard,
        handlers::lihat_aktivitas_terbaru,
        handlers::broadcast_notifikasi,
        handlers::lihat_notifikasi
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
            handlers::InputUbahPassword,
            // Struct Respon Umum
            handlers::InputKontak,
            // Struct Untuk Wilayah, Kategori, Transaksi, Tabungan
            handlers::InputWilayah,
            handlers::InputKategori,
            handlers::InputTransaksi,
            handlers::FilterExport,
            handlers::InputTarik,
            handlers::TransaksiLengkap,
            handlers::RekapDashboard,
            handlers::TabunganLengkap,
            handlers::LeaderboardItem,
            handlers::InputBroadcastNotifikasi
        )
    ),
    modifiers(&SecurityAddon),
    tags(
        (name = "Auth", description = "Endpoint untuk Autentikasi (Register, Login, Lupa Password)"),
        (name = "Manajemen User", description = "Endpoint untuk pengaturan User dan 2FA"),
        (name = "Wilayah", description = "Endpoint untuk pengelolaan wilayah"),
        (name = "Kategori", description = "Endpoint untuk pengelolaan kategori sampah"),
        (name = "Transaksi", description = "Endpoint untuk mencatat dan mengelola transaksi sampah"),
        (name = "Tabungan", description = "Endpoint untuk melihat dan menarik saldo tabungan"),
        (name = "Dashboard", description = "Endpoint untuk statistik dan aktivitas dashboard"),
        (name = "Notifikasi", description = "Endpoint untuk history notifikasi")
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
    let db = Database::connect(&db_url)
        .await
        .expect("Gagal menyambung ke database! Pastikan Podman nyala.");
    println!("✅ Berhasil tersambung ke PostgreSQL!");

    println!("Memulai pemeriksaan dan migrasi tabel otomatis...");
    Migrator::up(&db, None)
        .await
        .expect("Gagal melakukan migrasi database!");
    println!("✅ Migrasi database selesai dan siap digunakan!");

    // Buat aturan CORS (Jembatan Lintas Domain)
    let jembatan_cors = CorsLayer::new()
        // Izinkan tamu dari alamat mana saja (nanti bisa diganti ke localhost:5173 spesifik kalau mau lebih ketat)
        .allow_origin(Any)
        // Izinkan mereka membawa JWT dan format JSON
        .allow_headers([header::AUTHORIZATION, header::CONTENT_TYPE])
        // Izinkan mereka melakukan aksi CRUD
        .allow_methods([Method::GET, Method::POST, Method::PUT, Method::DELETE]);

    // Buat channel untuk WebSocket (Kapasitas maksimal antrian 100 pesan)
    let (tx, _rx) = tokio::sync::broadcast::channel::<String>(100);

    // Buat wilayah
    let rute_wilayah = Router::new()
        .route(
            "/",
            get(handlers::lihat_wilayah).post(handlers::tambah_wilayah),
        )
        .route("/aktif", get(handlers::lihat_wilayah_aktif))
        .route(
            "/{id}",
            put(handlers::update_wilayah).delete(handlers::hapus_wilayah),
        )
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Kategori
    let rute_kategori = Router::new()
        .route(
            "/",
            get(handlers::lihat_kategori).post(handlers::tambah_kategori),
        )
        .route(
            "/{id}",
            put(handlers::update_kategori).delete(handlers::hapus_kategori),
        )
        .route_layer(middleware::from_fn(handlers::token_jwt));

    let rute_transaksi = Router::new()
        .route(
            "/",
            get(handlers::lihat_transaksi).post(handlers::tambah_transaksi),
        )
        .route("/export", get(handlers::export_transaksi))
        .route(
            "/{id}",
            put(handlers::update_transaksi).delete(handlers::hapus_transaksi),
        )
        .route_layer(middleware::from_fn(handlers::token_jwt));

    let rute_tabungan = Router::new()
        .route("/", get(handlers::lihat_tabungan))
        .route("/tarik", post(handlers::tarik_saldo)) // Cukup GET saja, karena tabungan diisi otomatis!
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Dashboard
    let rute_dashboard = Router::new()
        .route("/", get(handlers::lihat_dashboard))
        .route("/leaderboard", get(handlers::lihat_leaderboard))
        .route("/{id}", get(handlers::lihat_dashboard_wilayah))
        .route("/{id}/aktivitas", get(handlers::lihat_aktivitas_terbaru))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Manajemen User (BARU)
    let rute_user = Router::new()
        .route("/", get(handlers::lihat_user))
        .route(
            "/{id}",
            put(handlers::update_user).delete(handlers::hapus_user),
        )
        .route("/ubah-password", put(handlers::ubah_password))
        .route("/setup-totp", post(handlers::setup_totp))
        .route("/aktifkan-totp", post(handlers::aktifkan_totp))
        .route_layer(middleware::from_fn(handlers::token_jwt));

    // Rute Notifikasi (WebSocket & Broadcast)
    let rute_notifikasi = Router::new()
        .route(
            "/",
            get(handlers::lihat_notifikasi).route_layer(middleware::from_fn(handlers::token_jwt)),
        )
        .route(
            "/broadcast",
            post(handlers::broadcast_notifikasi)
                .route_layer(middleware::from_fn(handlers::token_jwt)),
        )
        .route("/ws", get(handlers::ws_notifikasi)); // Endpoint terbuka khusus WebSocket

    // Titipkan kunci brankas (db) ke dalam aplikasi (State)
    let app = Router::new()
        .route(
            "/",
            get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }),
        )
        .route("/api/kontak", post(handlers::simpan_kontak))
        .route("/api/register", post(handlers::register)) // Rute untuk registrasi user baru
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
        .nest("/api/notifikasi", rute_notifikasi)
        .merge(SwaggerUi::new("/swagger-ui").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .with_state(db) // <-- Kunci dititipkan di sini
        .layer(Extension(tx)) // <-- Titipkan transmitter WebSocket ke seluruh aplikasi
        .layer(jembatan_cors);

    // Baca variabel HOST. Jika tidak ada di .env, otomatis pakai 127.0.0.1
    let host = std::env::var("HOST").unwrap_or_else(|_| "127.0.0.1".to_string());
    let bind_address = format!("{}:3000", host);

    let listener = tokio::net::TcpListener::bind(&bind_address).await.unwrap();
    println!("🚀 Server SIM-TH berjalan di http://{}", bind_address);
    axum::serve(listener, app).await.unwrap();
}
