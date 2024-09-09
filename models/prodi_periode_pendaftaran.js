"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProdiPeriodePendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      ProdiPeriodePendaftaran.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      ProdiPeriodePendaftaran.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  ProdiPeriodePendaftaran.init(
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
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "ProdiPeriodePendaftaran",
      tableName: "prodi_periode_pendaftarans"
    }
  );
  return ProdiPeriodePendaftaran;
};
