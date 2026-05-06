use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Wilayah::Table)
                    .if_not_exists()
                    .col(pk_auto(Wilayah::Id))               // wilayahID (Primary Key)
                    .col(string(Wilayah::Nama).unique_key()) // nama wilayah (tidak boleh kembar)
                    .col(string(Wilayah::Status))            // status (misal: "Aktif" / "Non-Aktif")
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Wilayah::Table).to_owned())
            .await
    }
}

// Kamus nama kolom untuk SeaORM
#[derive(DeriveIden)]
pub enum Wilayah {
    Table,
    Id,
    Nama,
    Status,
}
