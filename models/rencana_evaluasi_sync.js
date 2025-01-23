"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RencanaEvaluasiSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      RencanaEvaluasiSync.belongsTo(models.RencanaEvaluasi, { foreignKey: "id_rencana_evaluasi" });
    }
  }
  RencanaEvaluasiSync.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jenis_singkron: {
        type: DataTypes.ENUM(["create", "update", "delete"]),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_rencana_evaluasi: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RencanaEvaluasiSync",
      tableName: "rencana_evaluasi_syncs",
    }
  );
  return RencanaEvaluasiSync;
};
