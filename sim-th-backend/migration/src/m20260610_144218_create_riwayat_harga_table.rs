use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RiwayatHarga::Table)
                    .if_not_exists()
                    .col(pk_auto(RiwayatHarga::Id))
                    .col(integer(RiwayatHarga::KategoriId))
                    .col(integer(RiwayatHarga::HargaLama))
                    .col(integer(RiwayatHarga::HargaBaru))
                    .col(
                        timestamp(RiwayatHarga::TanggalPerubahan)
                            .default(Expr::current_timestamp()),
                    )
                    .col(string(RiwayatHarga::DiubahOleh))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-riwayatharga-kategori_id")
                            .from(RiwayatHarga::Table, RiwayatHarga::KategoriId)
                            .to(KategoriSampah::Table, KategoriSampah::Id)
                            .on_delete(ForeignKeyAction::Cascade)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RiwayatHarga::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RiwayatHarga {
    Table,
    Id,
    KategoriId,
    HargaLama,
    HargaBaru,
    TanggalPerubahan,
    DiubahOleh,
}

#[derive(DeriveIden)]
enum KategoriSampah {
    Table,
    Id,
}
