use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(TabunganSampah::Table)
                    .if_not_exists()
                    .col(pk_auto(TabunganSampah::Id))
                    // Saldo otomatis mulai dari 0.0
                    .col(float(TabunganSampah::Saldo).default(0.0)) 
                    .col(string(TabunganSampah::Status))
                    
                    // --- RELASI 1-TO-1 KE WILAYAH ---
                    // Wajib unik agar 1 wilayah cuma punya 1 tabungan
                    .col(integer(TabunganSampah::WilayahId).unique_key()) 
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-tabungan-wilayah")
                            .from(TabunganSampah::Table, TabunganSampah::WilayahId)
                            .to(Wilayah::Table, Wilayah::Id)
                            .on_delete(ForeignKeyAction::Cascade) // Kalau wilayah dihapus, tabungannya ikut hangus
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(TabunganSampah::Table).to_owned())
            .await
    }
}

// Kamus Kolom
#[derive(DeriveIden)]
pub enum TabunganSampah {
    Table,
    Id,
    Saldo,
    Status,
    WilayahId,
}

// Referensi ke Tabel Wilayah
#[derive(DeriveIden)]
pub enum Wilayah {
    Table,
    Id,
}