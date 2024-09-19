"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PengaturanPMB extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PengaturanPMB.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      upload_bukti_transfer: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      nama_bank: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      nomor_rekening: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      nama_pemilik_rekening: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "PengaturanPMB",
      tableName: "pengaturan_pmbs"
    }
  );
  return PengaturanPMB;
};
