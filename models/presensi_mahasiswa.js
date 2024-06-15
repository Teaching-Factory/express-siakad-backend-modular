"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PresensiMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PresensiMahasiswa.belongsTo(models.PertemuanPerkuliahan, { foreignKey: "id_pertemuan_perkuliahan" });
      PresensiMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
    }
  }
  PresensiMahasiswa.init(
    {
      presensi_hadir: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      tanggal_presensi: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_DATE"),
      },
      waktu_presensi: {
        type: DataTypes.TIME,
        allowNull: false,
        defaultValue: sequelize.literal("CURRENT_TIME"),
      },
      status_presensi: {
        type: DataTypes.ENUM(["Hadir", "Izin", "Alfa", "Sakit"]),
        allowNull: false,
      },
      id_pertemuan_perkuliahan: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PresensiMahasiswa",
      tableName: "presensi_mahasiswas",
    }
  );
  return PresensiMahasiswa;
};
