"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosenWali extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DosenWali.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      DosenWali.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      DosenWali.belongsTo(models.TahunAjaran, { foreignKey: "id_tahun_ajaran" });
    }
  }
  DosenWali.init(
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
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_registrasi_mahasiswa must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_registrasi_mahasiswa must be a string");
          }
        },
      },
      id_tahun_ajaran: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "id_tahun_ajaran must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "DosenWali",
      tableName: "dosen_walis",
    }
  );
  return DosenWali;
};
