"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProfilPenilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ProfilPenilaian.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nilai_min: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      nilai_max: {
        type: DataTypes.INTEGER(3),
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      nilai_indeks: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
        validate: {
          min: 0,
          max: 4,
        },
      },
      nilai_huruf: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ProfilPenilaian",
      tableName: "profil_penilaians",
    }
  );
  return ProfilPenilaian;
};
