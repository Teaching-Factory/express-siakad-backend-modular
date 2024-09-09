"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SumberPeriodePendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SumberPeriodePendaftaran.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      SumberPeriodePendaftaran.belongsTo(models.Sumber, { foreignKey: "id_sumber" });
    }
  }
  SumberPeriodePendaftaran.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_periode_pendaftaran: {
        type: DataTypes.INTEGER(10),
        allowNull: false
      },
      id_sumber: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "SumberPeriodePendaftaran",
      tableName: "sumber_periode_pendaftarans"
    }
  );
  return SumberPeriodePendaftaran;
};
