use axum::{routing::{get, post}, Router};

// Kenalkan file handlers.rs ke compiler Rust
mod handlers;

#[tokio::main]
async fn main() {
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }))
        // Panggil fungsinya dari modul handlers
        .route("/api/setoran", post(handlers::terima_setoran));

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server SIM-TH berjalan di http://localhost:3000");
    axum::serve(listener, app).await.unwrap();
}