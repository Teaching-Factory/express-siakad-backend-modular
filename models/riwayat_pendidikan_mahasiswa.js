"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RiwayatPendidikanMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      RiwayatPendidikanMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      RiwayatPendidikanMahasiswa.belongsTo(models.JenisPendaftaran, { foreignKey: "id_jenis_daftar" });
      RiwayatPendidikanMahasiswa.belongsTo(models.JalurMasuk, { foreignKey: "id_jalur_daftar" });
      RiwayatPendidikanMahasiswa.belongsTo(models.Semester, { foreignKey: "id_periode_masuk" });
      RiwayatPendidikanMahasiswa.belongsTo(models.JenisKeluar, { foreignKey: "id_jenis_keluar" });
      RiwayatPendidikanMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      RiwayatPendidikanMahasiswa.belongsTo(models.Pembiayaan, { foreignKey: "id_pembiayaan" });
      RiwayatPendidikanMahasiswa.belongsTo(models.BidangMinat, { foreignKey: "id_bidang_minat" });
      RiwayatPendidikanMahasiswa.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi_asal" });
      RiwayatPendidikanMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi_asal" });
    }
  }
  RiwayatPendidikanMahasiswa.init(
    {
      tanggal_daftar: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      keterangan_keluar: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      sks_diakui: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      nama_ibu_kandung: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      biaya_masuk: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_jenis_daftar: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: false,
      },
      id_jalur_daftar: {
        type: DataTypes.DECIMAL(4, 0),
        allowNull: true,
      },
      id_periode_masuk: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_jenis_keluar: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_pembiayaan: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_bidang_minat: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_perguruan_tinggi_asal: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_prodi_asal: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RiwayatPendidikanMahasiswa",
      tableName: "riwayat_pendidikan_mahasiswas",
    }
  );
  return RiwayatPendidikanMahasiswa;
};
