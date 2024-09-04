"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SettingGlobalSemester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SettingGlobalSemester.belongsTo(models.Semester, { as: "SemesterAktif", foreignKey: "id_semester_aktif" });
      SettingGlobalSemester.belongsTo(models.Semester, { as: "SemesterNilai", foreignKey: "id_semester_nilai" });
      SettingGlobalSemester.belongsTo(models.Semester, { as: "SemesterKrs", foreignKey: "id_semester_krs" });
    }
  }
  SettingGlobalSemester.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      batas_sks_krs: {
        type: DataTypes.INTEGER(4),
        allowNull: false
      },
      wilayah_penandatanganan: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      label_dosen_wali: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_semester_aktif: {
        type: DataTypes.CHAR(5),
        allowNull: false
      },
      id_semester_nilai: {
        type: DataTypes.CHAR(5),
        allowNull: false
      },
      id_semester_krs: {
        type: DataTypes.CHAR(5),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "SettingGlobalSemester",
      tableName: "setting_global_semesters"
    }
  );
  return SettingGlobalSemester;
};
