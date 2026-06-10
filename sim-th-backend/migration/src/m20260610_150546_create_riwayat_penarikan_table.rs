use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RiwayatPenarikan::Table)
                    .if_not_exists()
                    .col(pk_auto(RiwayatPenarikan::Id))
                    .col(integer(RiwayatPenarikan::WilayahId))
                    .col(integer(RiwayatPenarikan::Nominal))
                    .col(timestamp(RiwayatPenarikan::TanggalPenarikan).default(Expr::current_timestamp()))
                    .col(string(RiwayatPenarikan::DitarikOleh))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-riwayatpenarikan-wilayah_id")
                            .from(RiwayatPenarikan::Table, RiwayatPenarikan::WilayahId)
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
            .drop_table(Table::drop().table(RiwayatPenarikan::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum RiwayatPenarikan {
    Table,
    Id,
    WilayahId,
    Nominal,
    TanggalPenarikan,
    DitarikOleh,
}

#[derive(DeriveIden)]
enum Wilayah {
    Table,
    Id,
}
