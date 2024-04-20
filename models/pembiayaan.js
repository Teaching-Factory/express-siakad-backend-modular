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
      Pembiayaan.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_pembiayaan" });
    }
  }
  Pembiayaan.init(
    {
      nama_pembiayaan: {
        type: DataTypes.TRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Pembiayaan",
      tableName: "pembiayaans",
    }
  );
  return Pembiayaan;
};
