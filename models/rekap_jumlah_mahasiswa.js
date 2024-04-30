"use strict";
const { Model } = require("sequelize");
const { Sequelize } = require(".");
module.exports = (sequelize, DataTypes) => {
  class RekapJumlahMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      RekapJumlahMahasiswa.belongsTo(models.Periode, { foreignKey: "id_periode" });
      RekapJumlahMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  RekapJumlahMahasiswa.init(
    {
      id_rekap_jumlah_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_periode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      aktif: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      cuti: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      non_aktif: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      sedang_double_degree: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      id_periode: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RekapJumlahMahasiswa",
      tableName: "rekap_jumlah_mahasiswas",
    }
  );
  return RekapJumlahMahasiswa;
};
