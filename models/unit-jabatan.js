"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UnitJabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      UnitJabatan.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      UnitJabatan.belongsTo(models.Jabatan, { foreignKey: "id_jabatan" });
      UnitJabatan.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  UnitJabatan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_penandatanganan: {
        type: DataTypes.STRING(200),
        allowNull: false,
        validate: {
          len: { args: [1, 200], msg: "nama_penandatanganan must be between 1 and 200 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_penandatanganan must be a string");
          }
        },
      },
      id_jabatan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "id_jabatan must be an integer",
          },
        },
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
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_prodi must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_prodi must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "UnitJabatan",
      tableName: "unit_jabatans",
    }
  );
  return UnitJabatan;
};
