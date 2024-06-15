"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Role.hasMany(models.UserRole, { foreignKey: "id_role" });
    }
  }
  Role.init(
    {
      nama_role: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          // notEmpty: { args: true, msg: "nama_role is required" },
          // notNull: { args: true, msg: "nama_role is required" },
          len: { args: [1, 50], msg: "nama_role must be between 1 and 50 characters" },
          // isString(value) {
          //   if (typeof value !== "string") {
          //     throw new Error("nama_role must be a string");
          //   }
          // },
        },
      },
    },
    {
      sequelize,
      modelName: "Role",
      tableName: "roles",
    }
  );
  return Role;
};
