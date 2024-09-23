"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Pembiayaan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Pembiayaan.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_pembiayaan" });
      Pembiayaan.hasMany(models.PerkuliahanMahasiswa, { foreignKey: "id_pembiayaan" });
      Pembiayaan.hasMany(models.Camaba, { foreignKey: "id_pembiayaan" });
    }
  }
  Pembiayaan.init(
    {
      id_pembiayaan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      nama_pembiayaan: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Pembiayaan",
      tableName: "pembiayaans"
    }
  );
  return Pembiayaan;
};
