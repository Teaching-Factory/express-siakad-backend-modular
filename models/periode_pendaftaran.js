"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PeriodePendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PeriodePendaftaran.belongsTo(models.Semester, { foreignKey: "id_semester" });
      PeriodePendaftaran.belongsTo(models.JalurMasuk, { foreignKey: "id_jalur_masuk" });
      PeriodePendaftaran.belongsTo(models.SistemKuliah, { foreignKey: "id_sistem_kuliah" });

      // relasi tabel child
      PeriodePendaftaran.hasMany(models.SumberPeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      PeriodePendaftaran.hasMany(models.ProdiPeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      PeriodePendaftaran.hasMany(models.BerkasPeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      PeriodePendaftaran.hasMany(models.TahapTesPeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
    }
  }
  PeriodePendaftaran.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      nama_periode_pendaftaran: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      tanggal_awal_pendaftaran: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      tanggal_akhir_pendaftaran: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      dibuka: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      },
      berbayar: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      biaya_pendaftaran: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0
      },
      batas_akhir_pembayaran: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      jumlah_pilihan_prodi: {
        type: DataTypes.ENUM(["1", "2 ", "3"]),
        allowNull: false
      },
      deskripsi_singkat: {
        type: DataTypes.STRING(80),
        allowNull: true
      },
      konten_informasi: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      sumber_informasi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false
      },
      id_jalur_masuk: {
        type: DataTypes.DECIMAL(4, 0),
        allowNull: false
      },
      id_sistem_kuliah: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "PeriodePendaftaran",
      tableName: "periode_pendaftarans"
    }
  );
  return PeriodePendaftaran;
};
