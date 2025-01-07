"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AdminProdi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      AdminProdi.belongsTo(models.User, { foreignKey: "id_user" });
      AdminProdi.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  AdminProdi.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      id_user: {
        type: DataTypes.INTEGER(20),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AdminProdi",
      tableName: "admin_prodis",
    }
  );
  return AdminProdi;
};
