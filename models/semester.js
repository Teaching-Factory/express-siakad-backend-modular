"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Semester.belongsTo(models.TahunAjaran, { foreignKey: "id_tahun_ajaran" });
      Semester.hasMany(models.Kurikulum, { foreignKey: "id_semester" });
      Semester.hasMany(models.DetailKurikulum, { foreignKey: "id_semester" });
      Semester.hasMany(models.MatkulKurikulum, { foreignKey: "id_semester" });
    }
  }
  Semester.init(
    {
      nama_semester: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      semester: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
      },
      id_tahun_ajaran: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Semester",
      tableName: "semesters",
    }
  );
  return Semester;
};
