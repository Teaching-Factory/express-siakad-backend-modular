"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KebutuhanKhusus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      KebutuhanKhusus.hasMany(models.BiodataMahasiswa, { foreignKey: "id_kebutuhan_khusus_mahasiswa" });
      KebutuhanKhusus.hasMany(models.BiodataMahasiswa, { foreignKey: "id_kebutuhan_khusus_ayah" });
      KebutuhanKhusus.hasMany(models.BiodataMahasiswa, { foreignKey: "id_kebutuhan_khusus_ibu" });
      KebutuhanKhusus.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_kebutuhan_khusus_mahasiswa" });
      KebutuhanKhusus.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_kebutuhan_khusus_ayah" });
      KebutuhanKhusus.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_kebutuhan_khusus_ibu" });
    }
  }
  KebutuhanKhusus.init(
    {
      id_kebutuhan_khusus: {
        allowNull: false,
        // autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_kebutuhan_khusus: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "KebutuhanKhusus",
      tableName: "kebutuhan_khusus",
    }
  );
  return KebutuhanKhusus;
};
