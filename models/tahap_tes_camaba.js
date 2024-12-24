"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TahapTesCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      TahapTesCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
      TahapTesCamaba.belongsTo(models.TahapTesPeriodePendaftaran, { foreignKey: "id_tahap_tes_periode_pendaftaran" });
    }
  }
  TahapTesCamaba.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      status: {
        type: DataTypes.ENUM("Lulus", "Tidak Lulus", "Menunggu Persetujuan"),
        allowNull: false,
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_tahap_tes_periode_pendaftaran: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TahapTesCamaba",
      tableName: "tahap_tes_camabas",
    }
  );
  return TahapTesCamaba;
};
