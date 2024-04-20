"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatkulKRS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MatkulKRS.belongsTo(models.KRSMahasiswa, { foreignKey: "id_krs" });
      MatkulKRS.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
    }
  }
  MatkulKRS.init(
    {
      id_krs: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MatkulKRS",
      tableName: "matkul_krs",
    }
  );
  return MatkulKRS;
};
