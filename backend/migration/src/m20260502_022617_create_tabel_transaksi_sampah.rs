use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TransaksiSampah::Table)
                    .if_not_exists()
                    .col(pk_auto(TransaksiSampah::Id))
                    // Catat waktu transaksi otomatis
                    .col(timestamp(TransaksiSampah::Tanggal).default(Expr::current_timestamp())) 
                    .col(float(TransaksiSampah::Berat))
                    .col(float(TransaksiSampah::TotalNilai))
                    .col(string(TransaksiSampah::Status))
                    
                    // --- KOLOM UNTUK FOREIGN KEY ---
                    .col(integer(TransaksiSampah::KategoriId))
                    .col(integer(TransaksiSampah::WilayahId))
                    .col(integer(TransaksiSampah::InputBy)) // ID Petugas BEM yang mencatat
                    
                    // 1. Relasi ke Kategori Sampah
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-transaksi-kategori")
                            .from(TransaksiSampah::Table, TransaksiSampah::KategoriId)
                            .to(KategoriSampah::Table, KategoriSampah::Id)
                            .on_delete(ForeignKeyAction::Restrict) // Cegah hapus kategori kalau sudah ada transaksinya
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    // 2. Relasi ke Wilayah
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-transaksi-wilayah")
                            .from(TransaksiSampah::Table, TransaksiSampah::WilayahId)
                            .to(Wilayah::Table, Wilayah::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    // 3. Relasi ke User (Petugas Input)
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-transaksi-user")
                            .from(TransaksiSampah::Table, TransaksiSampah::InputBy)
                            .to(User::Table, User::Id)
                            .on_delete(ForeignKeyAction::Restrict)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TransaksiSampah::Table).to_owned())
            .await
    }
}

// Kamus Kolom Utama
#[derive(DeriveIden)]
pub enum TransaksiSampah {
    Table,
    Id,
    Tanggal,
    Berat,
    TotalNilai,
    Status,
    KategoriId,
    WilayahId,
    InputBy,
}

// Kamus Referensi Tabel Lain
#[derive(DeriveIden)]
pub enum KategoriSampah { Table, Id }
#[derive(DeriveIden)]
pub enum Wilayah { Table, Id }
#[derive(DeriveIden)]
pub enum User { Table, Id }