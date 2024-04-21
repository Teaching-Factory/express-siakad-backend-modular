"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class LembagaPengangkatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      LembagaPengangkatan.hasMany(models.BiodataDosen, { foreignKey: "id_lembaga_pengangkatan" });
    }
  }
  LembagaPengangkatan.init(
    {
      nama_lembaga_angkat: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "LembagaPengangkatan",
      tableName: "lembaga_pengangkatans",
    }
  );
  return LembagaPengangkatan;
};
