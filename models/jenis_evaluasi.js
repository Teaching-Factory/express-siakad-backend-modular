"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisEvaluasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisEvaluasi.hasMany(models.DosenPengajarKelasKuliah, { foreignKey: "id_jenis_evaluasi" });
    }
  }
  JenisEvaluasi.init(
    {
      id_jenis_evaluasi: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.SMALLINT,
      },
      nama_jenis_evaluasi: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisEvaluasi",
      tableName: "jenis_evaluasis",
    }
  );
  return JenisEvaluasi;
};
