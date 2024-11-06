"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pekerjaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Pekerjaan.hasMany(models.BiodataDosen, { foreignKey: "id_pekerjaan_suami_istri" });
      Pekerjaan.hasMany(models.BiodataMahasiswa, { foreignKey: "id_pekerjaan_ayah" });
      Pekerjaan.hasMany(models.BiodataMahasiswa, { foreignKey: "id_pekerjaan_ibu" });
      Pekerjaan.hasMany(models.BiodataMahasiswa, { foreignKey: "id_pekerjaan_wali" });
      Pekerjaan.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_pekerjaan_ayah" });
      Pekerjaan.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_pekerjaan_ibu" });
      Pekerjaan.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_pekerjaan_wali" });
      Pekerjaan.hasMany(models.BiodataCamaba, { foreignKey: "id_pekerjaan_ayah" });
      Pekerjaan.hasMany(models.BiodataCamaba, { foreignKey: "id_pekerjaan_ibu" });
      Pekerjaan.hasMany(models.BiodataCamaba, { foreignKey: "id_pekerjaan_wali" });
    }
  }
  Pekerjaan.init(
    {
      id_pekerjaan: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_pekerjaan: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Pekerjaan",
      tableName: "pekerjaans",
    }
  );
  return Pekerjaan;
};
