"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Negara extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Negara.hasMany(models.Wilayah, { foreignKey: "id_negara" });
    }
  }
  Negara.init(
    {
      id_negara: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.CHAR(2),
      },
      nama_negara: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Negara",
      tableName: "negaras",
    }
  );
  return Negara;
};
