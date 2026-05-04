use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.alter_table(
            Table::alter()
                .table(User::Table)
                .add_column(ColumnDef::new(User::OtpReset).string_len(10).null())
                .add_column(ColumnDef::new(User::OtpKadaluarsa).big_integer().null())
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager.alter_table(
            Table::alter()
                .table(User::Table)
                .drop_column(User::OtpReset)
                .drop_column(User::OtpKadaluarsa)
                .to_owned(),
        ).await
    }
}

#[derive(DeriveIden)]
enum User {
    #[sea_orm(iden = "user")]
    Table,
    OtpReset,
    OtpKadaluarsa,
}
