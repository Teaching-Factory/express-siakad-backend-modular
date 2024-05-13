"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SistemKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SistemKuliah.hasMany(models.SistemKuliahMahasiswa, { foreignKey: "id_sistem_kuliah" });
    }
  }
  SistemKuliah.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_sk: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      kode_sk: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SistemKuliah",
      tableName: "sistem_kuliahs",
    }
  );
  return SistemKuliah;
};
