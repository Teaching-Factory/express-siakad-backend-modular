"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PelimpahanMataKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PelimpahanMataKuliah.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      PelimpahanMataKuliah.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
    }
  }
  PelimpahanMataKuliah.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PelimpahanMataKuliah",
      tableName: "pelimpahan_mata_kuliahs",
    }
  );
  return PelimpahanMataKuliah;
};
