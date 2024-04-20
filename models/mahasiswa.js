"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Mahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Mahasiswa.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi" });
      Mahasiswa.belongsTo(models.Agama, { foreignKey: "id_agama" });
      Mahasiswa.belongsTo(models.Periode, { foreignKey: "id_periode" });
      Mahasiswa.hasMany(models.BiodataMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.DetailNilaiPerkuliahanKelas, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.RiwayatNilaiMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.PesertaKelasKuliah, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.PerkuliahanMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.DetailPerkuliahanMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.KRSMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Mahasiswa.hasMany(models.AktivitasKuliahMahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
    }
  }
  Mahasiswa.init(
    {
      nama_mahasiswa: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      nipd: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      ipk: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      total_sks: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      nama_status_mahasiswa: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nim: {
        type: DataTypes.STRING(24),
        allowNull: true,
      },
      nama_periode_masuk: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      id_sms: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_perguruan_tinggi: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_agama: {
        type: DataTypes.SMALLINT(5),
        allowNull: false,
      },
      id_periode: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Mahasiswa",
      tableName: "mahasiswas",
    }
  );
  return Mahasiswa;
};
