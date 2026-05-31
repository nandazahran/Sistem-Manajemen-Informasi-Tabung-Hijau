use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "rekening_wilayah")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub wilayah_id: i32,
    pub nama_bank: String,
    pub no_rekening: String,
    pub atas_nama: String,
    pub is_utama: bool,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::wilayah::Entity",
        from = "Column::WilayahId",
        to = "super::wilayah::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Wilayah,
}

impl Related<super::wilayah::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Wilayah.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}