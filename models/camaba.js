"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Camaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Camaba.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      Camaba.belongsTo(models.Prodi, { foreignKey: "id_prodi_diterima" });

      // relasi tabel child
      Camaba.hasMany(models.ProdiCamaba, { foreignKey: "id_camaba" });
      Camaba.hasMany(models.BiodataCamaba, { foreignKey: "id_camaba" });
      Camaba.hasMany(models.PemberkasanCamaba, { foreignKey: "id_camaba" });
    }
  }
  Camaba.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4
      },
      nomor_daftar: {
        type: DataTypes.STRING(13),
        allowNull: false
      },
      hints: {
        type: DataTypes.STRING(8),
        allowNull: false
      },
      tanggal_pendaftaran: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      nama_lengkap: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      foto_profil: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      tempat_lahir: {
        type: DataTypes.STRING(32),
        allowNull: false
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false
      },
      jenis_kelamin: {
        type: DataTypes.ENUM("Laki-laki", "Perempuan"),
        allowNull: false
      },
      nomor_hp: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      status_pembayaran: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status_berkas: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      status_tes: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      finalisasi: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_prodi_diterima: {
        type: DataTypes.STRING(36),
        allowNull: true
      },
      id_periode_pendaftaran: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Camaba",
      tableName: "camabas"
    }
  );
  return Camaba;
};
