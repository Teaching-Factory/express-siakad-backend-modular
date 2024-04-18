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
      MatkulKurikulum.belongsTo(models.Kurikulum, { foreignKey: "id_kurikulum" });
      MatkulKurikulum.belongsTo(models.ListMataKuliah, { foreignKey: "id_matkul" });
      MatkulKurikulum.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      MatkulKurikulum.belongsTo(models.Semester, { foreignKey: "id_semester" });
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
      },
      id_kurikulum: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MatkulKurikulum",
      tableName: "matkul_kurikulums",
    }
  );
  return MatkulKurikulum;
};
