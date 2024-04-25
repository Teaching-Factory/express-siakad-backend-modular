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
      // relasi tabel child
      PangkatGolongan.hasMany(models.BiodataDosen, { foreignKey: "id_pangkat_golongan" });
    }
  }
  PangkatGolongan.init(
    {
      id_pangkat_golongan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(2),
      },
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
