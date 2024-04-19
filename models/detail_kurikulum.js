"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailKurikulum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DetailKurikulum.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      DetailKurikulum.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  DetailKurikulum.init(
    {
      sks_wajib: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      sks_pilihan: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      id_kurikulum: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DetailKurikulum",
      tableName: "detail_kurikulums",
    }
  );
  return DetailKurikulum;
};
