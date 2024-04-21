"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MatkulKurikulum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      MatkulKurikulum.belongsTo(models.Kurikulum, { foreignKey: "id_kurikulum" });
      MatkulKurikulum.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
    }
  }
  MatkulKurikulum.init(
    {
      semester: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: false,
      },
      apakah_wajib: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      tgl_create: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      id_kurikulum: {
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
      modelName: "MatkulKurikulum",
      tableName: "matkul_kurikulums",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date().toISOString().split("T")[0];
        },
      },
    }
  );
  return MatkulKurikulum;
};
