"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailMataKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailMataKuliah.belongsTo(models.ListMataKuliah, { foreignKey: "id_matkul" });
      DetailMataKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  DetailMataKuliah.init(
    {
      id_matkul: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DetailMataKuliah",
      tableName: "detail_mata_kuliahs",
    }
  );
  return DetailMataKuliah;
};
