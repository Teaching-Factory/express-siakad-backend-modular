"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AlatTransportasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AlatTransportasi.hasMany(models.BiodataMahasiswa, { foreignKey: "id_alat_transportasi" });
      AlatTransportasi.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_alat_transportasi" });
    }
  }
  AlatTransportasi.init(
    {
      nama_alat_transportasi: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AlatTransportasi",
      tableName: "alat_transportasis",
    }
  );
  return AlatTransportasi;
};
