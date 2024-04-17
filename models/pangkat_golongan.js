"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PangkatGolongan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  PangkatGolongan.init(
    {
      kode_golongan: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      nama_pangkat: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PangkatGolongan",
      tableName: "pangkat_golongans",
    }
  );
  return PangkatGolongan;
};
