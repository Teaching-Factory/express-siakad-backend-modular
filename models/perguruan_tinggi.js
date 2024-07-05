"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerguruanTinggi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      PerguruanTinggi.hasMany(models.ProfilPT, { foreignKey: "id_perguruan_tinggi" });
      PerguruanTinggi.hasMany(models.PenugasanDosen, { foreignKey: "id_perguruan_tinggi" });
      PerguruanTinggi.hasMany(models.Mahasiswa, { foreignKey: "id_perguruan_tinggi" });
      PerguruanTinggi.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_perguruan_tinggi_asal" });
      PerguruanTinggi.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_perguruan_tinggi_asal" });
    }
  }
  PerguruanTinggi.init(
    {
      id_perguruan_tinggi: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      kode_perguruan_tinggi: {
        type: DataTypes.STRING(8),
        allowNull: false,
        validate: {
          len: { args: [1, 8], msg: "kode_perguruan_tinggi must be between 1 and 8 characters" },
        },
      },
      nama_perguruan_tinggi: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: { args: [0, 100], msg: "nama_perguruan_tinggi must be between 0 and 100 characters" },
        },
      },
      nama_singkat: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: { args: [0, 20], msg: "nama_singkat must be between 0 and 20 characters" },
        },
      },
    },
    {
      sequelize,
      modelName: "PerguruanTinggi",
      tableName: "perguruan_tinggis",
    }
  );
  return PerguruanTinggi;
};
