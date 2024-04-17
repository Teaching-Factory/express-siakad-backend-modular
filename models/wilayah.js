"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wilayah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Wilayah.belongsTo(models.Negara, { foreignKey: "id_negara" });
      Wilayah.hasMany(models.BiodataDosen, { foreignKey: "id_wilayah" });
    }
  }
  Wilayah.init(
    {
      id_negara: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      nama_wilayah: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Wilayah",
      tableName: "wilayahs",
    }
  );
  return Wilayah;
};
