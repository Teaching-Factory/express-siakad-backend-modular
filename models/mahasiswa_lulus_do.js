"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MahasiswaLulusDO extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      MahasiswaLulusDO.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      MahasiswaLulusDO.belongsTo(models.JenisKeluar, { foreignKey: "id_jenis_keluar" });
      MahasiswaLulusDO.belongsTo(models.PeriodePerkuliahan, { foreignKey: "id_periode_keluar" });
    }
  }
  MahasiswaLulusDO.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      tanggal_keluar: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      nomor_sk_yudisium: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      tanggal_sk_yudisium: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      ipk: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      nomor_ijazah: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      jalur_skripsi: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      judul_skripsi: {
        type: DataTypes.STRING(128),
        allowNull: true,
      },
      bulan_awal_bimbingan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      bulan_akhir_bimbingan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_jenis_keluar: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_periode_keluar: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "MahasiswaLulusDO",
      tableName: "mahasiswa_lulus_dos",
    }
  );
  return MahasiswaLulusDO;
};
