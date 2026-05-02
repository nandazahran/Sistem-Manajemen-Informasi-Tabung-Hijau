pub use sea_orm_migration::prelude::*;

// 1. Panggil file migrasi wilayahmu (sesuaikan dengan nama file aslinya tanpa ekstensi .rs)
// Biasanya formatnya: mod mYYYYMMDD_HHMMSS_create_tabel_wilayah;
mod m20260502_013829_create_tabel_wilayah; mod m20260502_014459_create_tabel_kategori_sampah;
mod m20260502_015120_create_tabel_user;
mod m20260502_022617_create_tabel_transaksi_sampah;
mod m20260502_023012_create_tabel_tabungan_sampah;


pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20260502_013829_create_tabel_wilayah::Migration),
            Box::new(m20260502_014459_create_tabel_kategori_sampah::Migration),
            Box::new(m20260502_015120_create_tabel_user::Migration),
            Box::new(m20260502_022617_create_tabel_transaksi_sampah::Migration),
            Box::new(m20260502_023012_create_tabel_tabungan_sampah::Migration),
        ]
    }
}
