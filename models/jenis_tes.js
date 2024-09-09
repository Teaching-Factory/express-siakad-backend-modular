"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisTes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisTes.hasMany(models.TahapTesPeriodePendaftaran, { foreignKey: "id_jenis_tes" });
    }
  }
  JenisTes.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_tes: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      keterangan_singkat: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "JenisTes",
      tableName: "jenis_tes"
    }
  );
  return JenisTes;
};
