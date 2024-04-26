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
      // relasi tabel parent
      DetailKurikulum.belongsTo(models.Kurikulum, { foreignKey: "id_kurikulum" });
    }
  }
  DetailKurikulum.init(
    {
      id_detail_kurikulum: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
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
    },
    {
      sequelize,
      modelName: "DetailKurikulum",
      tableName: "detail_kurikulums",
    }
  );
  return DetailKurikulum;
};
