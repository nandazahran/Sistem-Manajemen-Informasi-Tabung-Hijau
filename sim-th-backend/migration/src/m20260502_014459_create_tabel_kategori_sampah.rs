use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(KategoriSampah::Table)
                    .if_not_exists()
                    .col(pk_auto(KategoriSampah::Id)) // kategoriID (Primary Key)
                    // Nama kategori wajib diisi dan tidak boleh kembar
                    .col(string(KategoriSampah::NamaKategori).unique_key()) 
                    // Harga konversi per kilogram (menggunakan tipe float/desimal)
                    .col(integer(KategoriSampah::HargaPerKg)) 
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(KategoriSampah::Table).to_owned())
            .await
    }
}

// Kamus nama kolom untuk SeaORM
#[derive(DeriveIden)]
pub enum KategoriSampah {
    Table,
    Id,
    NamaKategori,
    HargaPerKg,
}