use axum::{routing::get, Router};

#[tokio::main]
async fn main() {
    // 1. Membuat rute (URL)
    let app = Router::new()
        .route("/", get(|| async { "Halo Tim! Backend SIM-TH sudah menyala!" }));

    // 2. Menentukan alamat dan port pelayan berdiri
    let listener = tokio::net::TcpListener::bind("127.0.0.1:3000").await.unwrap();
    println!("Server SIM-TH berjalan di http://localhost:3000");

    // 3. Menyalakan server
    axum::serve(listener, app).await.unwrap();
}