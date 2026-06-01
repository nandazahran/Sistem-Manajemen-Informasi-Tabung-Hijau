use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(RekeningWilayah::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(RekeningWilayah::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    // Kolom ini yang akan nyambung ke tabel wilayah
                    .col(ColumnDef::new(RekeningWilayah::WilayahId).integer().not_null())
                    .col(ColumnDef::new(RekeningWilayah::NamaBank).string().not_null())
                    .col(ColumnDef::new(RekeningWilayah::NoRekening).string().not_null())
                    .col(ColumnDef::new(RekeningWilayah::AtasNama).string().not_null())
                    // is_utama diset default false
                    .col(
                        ColumnDef::new(RekeningWilayah::IsUtama)
                            .boolean()
                            .not_null()
                            .default(false),
                    )
                    // --- MEMBUAT RELASI FOREIGN KEY ---
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_rekening_ke_wilayah")
                            .from(RekeningWilayah::Table, RekeningWilayah::WilayahId)
                            .to(Wilayah::Table, Wilayah::Id)
                            .on_delete(ForeignKeyAction::Cascade) // Jika wilayah dihapus, rekeningnya ikut terhapus
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(RekeningWilayah::Table).to_owned())
            .await
    }
}

// Struct untuk memetakan nama kolom di tabel rekening
#[derive(DeriveIden)]
enum RekeningWilayah {
    Table,
    Id,
    WilayahId,
    NamaBank,
    NoRekening,
    AtasNama,
    IsUtama,
}

// Struct tambahan untuk mereferensikan tabel wilayah di Foreign Key
#[derive(DeriveIden)]
enum Wilayah {
    Table,
    Id,
}
