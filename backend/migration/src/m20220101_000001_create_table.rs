use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        // Fungsi "up" dieksekusi saat kita ingin MEMBUAT tabel
        manager
            .create_table(
                Table::create()
                    .table(Setoran::Table)
                    .if_not_exists()
                    .col(pk_auto(Setoran::Id)) // Primary Key, Auto Increment
                    .col(string(Setoran::IdWilayah))
                    .col(string(Setoran::Kategori))
                    .col(float(Setoran::BeratKg))
                    .col(float(Setoran::EstimasiHarga))
                    .to_owned(),
            )
            .await
    }

    // Fungsi "down" dieksekusi saat kita ingin MENGHAPUS tabel (rollback)
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        manager
            .drop_table(Table::drop().table(Setoran::Table).to_owned())
            .await
    }
}

// Ini adalah penamaan kolomnya agar tidak rawan typo (salah ketik)
#[derive(DeriveIden)]
enum Setoran {
    Table,
    Id,
    IdWilayah,
    Kategori,
    BeratKg,
    EstimasiHarga,
}