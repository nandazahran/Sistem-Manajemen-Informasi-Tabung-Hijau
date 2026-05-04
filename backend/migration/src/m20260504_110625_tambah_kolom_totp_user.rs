use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    // Secret key TOTP biasanya lumayan panjang, kita beri VARCHAR 64
                    .add_column(ColumnDef::new(User::TotpSecret).string_len(64).null())
                    // Tanda apakah user sudah berhasil sinkronisasi app TOTP-nya
                    .add_column(ColumnDef::new(User::TotpAktif).boolean().default(false).not_null())
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .alter_table(
                Table::alter()
                    .table(User::Table)
                    .drop_column(User::TotpSecret)
                    .drop_column(User::TotpAktif)
                    .to_owned(),
            )
            .await
    }
}

// Jangan lupa ubah Iden-nya juga di bawah:
#[derive(DeriveIden)]
enum User {
    #[sea_orm(iden = "user")]
    Table,
    TotpSecret,
    TotpAktif,
}