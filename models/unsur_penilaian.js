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
      },
      nama_unsur_penilaian: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nama_lembaga: {
        type: DataTypes.STRING(255),
        allowNull: false,
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
