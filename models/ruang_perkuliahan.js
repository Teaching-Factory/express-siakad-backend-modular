"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RuangPerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      RuangPerkuliahan.hasMany(models.DetailKelasKuliah, { foreignKey: "id_ruang_perkuliahan" });
      RuangPerkuliahan.hasMany(models.PertemuanPerkuliahan, { foreignKey: "id_ruang_perkuliahan" });
    }
  }
  RuangPerkuliahan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_ruang: {
        type: DataTypes.STRING(5),
        allowNull: false,
        validate: {
          len: { args: [1, 5], msg: "id_ruang must be between 1 and 5 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_ruang must be a string");
          }
        },
      },
      nama_ruang_perkuliahan: {
        type: DataTypes.STRING(20),
        allowNull: false,
        validate: {
          len: { args: [1, 20], msg: "nama_ruang_perkuliahan must be between 1 and 20 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_ruang_perkuliahan must be a string");
          }
        },
      },
      lokasi: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          len: { args: [1, 10], msg: "lokasi must be between 1 and 10 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("lokasi must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "RuangPerkuliahan",
      tableName: "ruang_perkuliahans",
    }
  );
  return RuangPerkuliahan;
};
