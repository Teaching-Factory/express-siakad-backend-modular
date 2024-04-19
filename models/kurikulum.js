"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kurikulum extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Kurikulum.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      Kurikulum.belongsTo(models.Semester, { foreignKey: "id_semester" });
      Kurikulum.hasMany(models.DetailKurikulum, { foreignKey: "id_kurikulum" });
      Kurikulum.hasMany(models.MatkulKurikulum, { foreignKey: "id_kurikulum" });
    }
  }
  Kurikulum.init(
    {
      nama_kurikulum: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      semester_mulai_berlaku: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      jumlah_sks_lulus: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_wajib: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_pilihan: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_mata_kuliah_wajib: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: false,
      },
      jumlah_sks_mata_kuliah_pilihan: {
        type: DataTypes.DECIMAL(3, 0),
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
      modelName: "Kurikulum",
      tableName: "kurikulums",
    }
  );
  return Kurikulum;
};
