"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Permission.hasMany(models.RolePermission, { foreignKey: "id_permission" });
    }
  }
  Permission.init(
    {
      nama_permission: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: { args: true, msg: "nama_permission is required" },
          notNull: { args: true, msg: "nama_permission is required" },
          len: { args: [1, 50], msg: "nama_permission must be between 1 and 50 characters" },
          isString(value) {
            if (typeof value !== "string") {
              throw new Error("nama_permission must be a string");
            }
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Permission",
      tableName: "permissions",
    }
  );
  return Permission;
};
