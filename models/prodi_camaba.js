"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProdiCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      ProdiCamaba.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      ProdiCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
    }
  }
  ProdiCamaba.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "ProdiCamaba",
      tableName: "prodi_camabas"
    }
  );
  return ProdiCamaba;
};
