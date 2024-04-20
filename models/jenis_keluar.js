"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisKeluar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JenisKeluar.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_jenis_keluar" });
    }
  }
  JenisKeluar.init(
    {
      jenis_keluar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      apa_mahasiswa: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisKeluar",
      tableName: "jenis_keluars",
    }
  );
  return JenisKeluar;
};
