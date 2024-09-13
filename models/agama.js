"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Agama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Agama.hasMany(models.Dosen, { foreignKey: "id_agama" });
      Agama.hasMany(models.Mahasiswa, { foreignKey: "id_agama" });
      Agama.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_agama" });
      Agama.hasMany(models.BiodataCamaba, { foreignKey: "id_agama" });
    }
  }
  Agama.init(
    {
      id_agama: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.SMALLINT(5)
      },
      nama_agama: {
        type: DataTypes.STRING(50),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Agama",
      tableName: "agamas"
    }
  );
  return Agama;
};
