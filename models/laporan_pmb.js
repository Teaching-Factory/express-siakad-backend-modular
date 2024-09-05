"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LaporanPMB extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      LaporanPMB.belongsTo(models.Jabatan, { foreignKey: "id_jabatan" });
    }
  }
  LaporanPMB.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      jenis_laporan: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      nama_penandatanganan: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      nomor_identitas: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      id_jabatan: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "LaporanPMB",
      tableName: "laporan_pmbs"
    }
  );
  return LaporanPMB;
};
