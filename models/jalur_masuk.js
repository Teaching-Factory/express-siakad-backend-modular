"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JalurMasuk extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JalurMasuk.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_jalur_daftar" });
    }
  }
  JalurMasuk.init(
    {
      nama_jalur_masuk: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JalurMasuk",
      tableName: "jalur_masuks",
    }
  );
  return JalurMasuk;
};
