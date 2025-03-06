"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KomponenEvaluasiKelasSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      KomponenEvaluasiKelasSync.belongsTo(models.KomponenEvaluasiKelas, { foreignKey: "id_komponen_evaluasi" });
    }
  }
  KomponenEvaluasiKelasSync.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jenis_singkron: {
        type: DataTypes.ENUM(["get", "create", "update", "delete"]),
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
      id_komponen_evaluasi: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KomponenEvaluasiKelasSync",
      tableName: "komponen_evaluasi_kelas_syncs",
    }
  );
  return KomponenEvaluasiKelasSync;
};
