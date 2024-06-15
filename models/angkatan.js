"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Angkatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Angkatan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      tahun: {
        type: DataTypes.STRING(4),
        allowNull: false,
        validate: {
          len: { args: [1, 4], msg: "tahun must be between 1 and 4 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("tahun must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "Angkatan",
      tableName: "angkatans",
    }
  );
  return Angkatan;
};
