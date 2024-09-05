"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Jabatan.hasMany(models.UnitJabatan, { foreignKey: "id_jabatan" });
      Jabatan.hasMany(models.LaporanPMB, { foreignKey: "id_jabatan" });
    }
  }
  Jabatan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      nama_jabatan: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: { args: [1, 100], msg: "nama_jabatan must be between 1 and 100 characters" }
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_jabatan must be a string");
          }
        }
      }
    },
    {
      sequelize,
      modelName: "Jabatan",
      tableName: "jabatans"
    }
  );
  return Jabatan;
};
