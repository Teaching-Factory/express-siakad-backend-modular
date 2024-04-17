"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProfilPT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ProfilPT.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi" });
    }
  }
  ProfilPT.init(
    {
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      faximile: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      dusun: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      rt_rw: {
        type: DataTypes.STRING(7),
        allowNull: true,
      },
      kelurahan: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      kode_pos: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      lintang_bujur: {
        type: DataTypes.STRING(24),
        allowNull: true,
      },
      bank: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      unit_cabang: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      nomor_rekening: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      mbs: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      luas_tanah_milik: {
        type: DataTypes.DECIMAL(7, 0),
        allowNull: false,
      },
      luas_tanah_bukan_milik: {
        type: DataTypes.DECIMAL(7, 0),
        allowNull: false,
      },
      sk_pendirian: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      tanggal_sk_pendirian: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_status_milik: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      nama_status_milik: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status_perguruan_tinggi: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      sk_izin_operasional: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      tanggal_izin_operasional: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_perguruan_tinggi: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "ProfilPT",
      tableName: "profil_pts",
    }
  );
  return ProfilPT;
};
