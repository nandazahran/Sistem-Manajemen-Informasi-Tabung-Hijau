use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Kontak::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Kontak::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Kontak::Nama).string().not_null())
                    .col(ColumnDef::new(Kontak::Email).string().not_null())
                    .col(ColumnDef::new(Kontak::Pesan).text().not_null())
                    .col(ColumnDef::new(Kontak::WaktuKirim).timestamp().not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Kontak::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
enum Kontak {
    Table,
    Id,
    Nama,
    Email,
    Pesan,
    WaktuKirim,
}
