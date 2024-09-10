"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UserGuidePMB extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserGuidePMB.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      file: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      type: {
        type: DataTypes.ENUM("PDF", "Video"),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "UserGuidePMB",
      tableName: "user_guide_pmbs"
    }
  );
  return UserGuidePMB;
};
