use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(User::Table)
                    .if_not_exists()
                    .col(pk_auto(User::Id))
                    .col(string(User::Username).unique_key())
                    .col(string(User::Email).unique_key())
                    .col(string(User::Password))
                    .col(string(User::Nama))
                    .col(string(User::Role))   // Isinya nanti: "Admin", "BEMWilayah", atau "DUI"
                    .col(string(User::Status)) // Isinya nanti: "Aktif" atau "Non-Aktif"
                    // Kolom wilayah_id boleh kosong (null) karena Admin dan DUI tidak terikat 1 wilayah spesifik
                    .col(integer_null(User::WilayahId)) 
                    // --- MEMBUAT RELASI (FOREIGN KEY) KE TABEL WILAYAH ---
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk-user-wilayah")
                            .from(User::Table, User::WilayahId)
                            .to(Wilayah::Table, Wilayah::Id)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(User::Table).to_owned())
            .await
    }
}

// Kamus nama kolom untuk tabel User
#[derive(DeriveIden)]
pub enum User {
    Table,
    Id,
    Username,
    Email,
    Password,
    Nama,
    Role,
    Status,
    WilayahId,
}

// Kita pinjam kamus Wilayah dari migration sebelumnya untuk referensi Foreign Key
#[derive(DeriveIden)]
pub enum Wilayah {
    Table,
    Id,
}
