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
      // relasi tabel child
      User.hasMany(models.UserRole, { foreignKey: "id_user" });
    }
  }
  User.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(20),
      },
      nama: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          len: { args: [1, 200], msg: "nama must be between 1 and 200 characters" },
        },
      },
      username: {
        type: DataTypes.STRING(13),
        allowNull: false,
        validate: {
          len: { args: [1, 13], msg: "username must be between 1 and 13 characters" },
        },
      },
      password: {
        type: DataTypes.STRING(255),
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
        validate: {
          len: { args: [1, 60], msg: "email must be between 1 and 60 characters" },
        },
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
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
