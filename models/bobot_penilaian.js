"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BobotPenilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      BobotPenilaian.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      BobotPenilaian.belongsTo(models.UnsurPenilaian, { foreignKey: "id_unsur_penilaian" });
    }
  }
  BobotPenilaian.init(
    {
      id_bobot_penilaian: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      bobot_penilaian: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_unsur_penilaian: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BobotPenilaian",
      tableName: "bobot_penilaians",
    }
  );
  return BobotPenilaian;
};
