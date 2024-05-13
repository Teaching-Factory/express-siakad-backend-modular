"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UnitJabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UnitJabatan.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
    }
  }
  UnitJabatan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_jabatan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UnitJabatan",
      tableName: "unit_jabatans",
    }
  );
  return UnitJabatan;
};
