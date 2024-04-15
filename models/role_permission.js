"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RolePermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RolePermission.belongsTo(models.Role, { foreignKey: "id_role" });
      RolePermission.belongsTo(models.Permission, { foreignKey: "id_permission" });
    }
  }
  RolePermission.init(
    {
      id_role: DataTypes.INTEGER,
      id_permission: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "RolePermission",
    }
  );
  return RolePermission;
};
