"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SemesterAktif extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SemesterAktif.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  SemesterAktif.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SemesterAktif",
      tableName: "semester_aktifs",
    }
  );
  return SemesterAktif;
};
