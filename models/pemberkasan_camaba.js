"use strict";
const { Model, BOOLEAN } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PemberkasanCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PemberkasanCamaba.belongsTo(models.BerkasPeriodePendaftaran, { foreignKey: "id_berkas_periode_pendaftaran" });
      PemberkasanCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
    }
  }
  PemberkasanCamaba.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      file_berkas: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status_berkas: {
        type: BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      id_berkas_periode_pendaftaran: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PemberkasanCamaba",
      tableName: "pemberkasan_camabas",
    }
  );
  return PemberkasanCamaba;
};
