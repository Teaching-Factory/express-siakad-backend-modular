"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SumberInfoCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SumberInfoCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
      SumberInfoCamaba.belongsTo(models.SumberPeriodePendaftaran, { foreignKey: "id_sumber_periode_pendaftaran" });
    }
  }
  SumberInfoCamaba.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_sumber: {
        type: DataTypes.STRING(50),
        allowNull: true
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_sumber_periode_pendaftaran: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "SumberInfoCamaba",
      tableName: "sumber_info_camabas"
    }
  );
  return SumberInfoCamaba;
};
