"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MataKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      MataKuliah.belongsTo(models.ListMataKuliah, { foreignKey: "id_matkul" });
    }
  }
  MataKuliah.init(
    {
      id_jenis_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_kelompok_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MataKuliah",
      tableName: "mata_kuliahs",
    }
  );
  return MataKuliah;
};
