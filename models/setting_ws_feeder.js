"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SettingWSFeeder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  SettingWSFeeder.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      url_feeder: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      username_feeder: {
        type: DataTypes.STRING(10),
        allowNull: false
      },
      password_feeder: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "SettingWSFeeder",
      tableName: "setting_ws_feeders"
    }
  );
  return SettingWSFeeder;
};
