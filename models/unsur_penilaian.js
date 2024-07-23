"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UnsurPenilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      UnsurPenilaian.hasMany(models.BobotPenilaian, { foreignKey: "id_unsur_penilaian" });
      UnsurPenilaian.hasMany(models.NilaiPerkuliahan, { foreignKey: "id_unsur_penilaian" });
    }
  }
  UnsurPenilaian.init(
    {
      id_unsur_penilaian: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_unsur: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: { args: [1, 10], msg: "id_unsur must be between 1 and 10 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_unsur must be a string");
          }
        },
      },
      nama_unsur_penilaian: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          len: { args: [1, 50], msg: "nama_unsur_penilaian must be between 1 and 50 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_unsur_penilaian must be a string");
          }
        },
      },
      nama_lembaga: {
        type: DataTypes.STRING(255),
        allowNull: false,
        validate: {
          len: { args: [1, 255], msg: "nama_lembaga must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_lembaga must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "UnsurPenilaian",
      tableName: "unsur_penilaians",
    }
  );
  return UnsurPenilaian;
};
