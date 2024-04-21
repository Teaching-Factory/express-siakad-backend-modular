"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisSubstansi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisSubstansi.hasMany(models.Substansi, { foreignKey: "id_jenis_substansi" });
    }
  }
  JenisSubstansi.init(
    {
      nama_jenis_substansi: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisSubstansi",
      tableName: "jenis_substansis",
    }
  );
  return JenisSubstansi;
};
