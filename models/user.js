"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      nama: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(12),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      hints: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
        unique: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "users",
    }
  );
  return User;
};
