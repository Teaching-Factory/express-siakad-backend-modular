"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Jabatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Jabatan.hasMany(models.UnitJabatan, { foreignKey: "id_jabatan" });
    }
  }
  Jabatan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nama_jabatan: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Jabatan",
      tableName: "jabatans",
    }
  );
  return Jabatan;
};
