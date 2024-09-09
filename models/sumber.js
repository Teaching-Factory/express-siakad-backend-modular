"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sumber extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Sumber.hasMany(models.SumberPeriodePendaftaran, { foreignKey: "id_sumber" });
    }
  }
  Sumber.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_sumber: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: true
      }
    },
    {
      sequelize,
      modelName: "Sumber",
      tableName: "sumbers"
    }
  );
  return Sumber;
};
