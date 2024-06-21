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
        validate: {
          len: { args: [1, 36], msg: "id_dosen must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_dosen must be a string");
          }
        },
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_matkul must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_matkul must be a string");
          }
        },
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
