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
      // relasi tabel child
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
        validate: {
          len: { args: [1, 255], msg: "nama_sk must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_sk must be a string");
          }
        },
      },
      kode_sk: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
          len: { args: [1, 4], msg: "kode_sk must be between 1 and 4 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("kode_sk must be a string");
          }
        },
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
