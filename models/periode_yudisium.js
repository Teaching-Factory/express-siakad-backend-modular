"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PeriodeYudisium extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PeriodeYudisium.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  PeriodeYudisium.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_periode_yudisium: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "PeriodeYudisium",
      tableName: "periode_yudisiums"
    }
  );
  return PeriodeYudisium;
};
