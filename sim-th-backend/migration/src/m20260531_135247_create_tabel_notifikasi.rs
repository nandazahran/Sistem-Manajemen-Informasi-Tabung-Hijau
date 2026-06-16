use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Notifikasi::Table)
                    .if_not_exists()
                    .col(pk_auto(Notifikasi::Id))
                    .col(string(Notifikasi::Tipe))
                    .col(string(Notifikasi::Judul))
                    .col(text(Notifikasi::Deskripsi))
                    // Kita simpan array role dalam format text (contoh: '["all"]' atau '["admin", "bem_km"]')
                    .col(text_null(Notifikasi::TargetRole))
                    .col(integer_null(Notifikasi::TargetWilayahId))
                    .col(timestamp(Notifikasi::Waktu).default(Expr::current_timestamp()))
                    .col(text_null(Notifikasi::ReadByUsers))
                    // Relasi ke wilayah jika notifikasi ini spesifik untuk 1 wilayah
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-notifikasi-wilayah")
                            .from(Notifikasi::Table, Notifikasi::TargetWilayahId)
                            .to(Wilayah::Table, Wilayah::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Notifikasi::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Notifikasi {
    Table,
    Id,
    Tipe,
    Judul,
    Deskripsi,
    TargetRole,
    TargetWilayahId,
    Waktu,
    ReadByUsers,
}

#[derive(DeriveIden)]
pub enum Wilayah {
    Table,
    Id,
}
