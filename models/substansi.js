"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Substansi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Substansi.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      Substansi.belongsTo(models.JenisSubstansi, { foreignKey: "id_jenis_substansi" });

      // relasi tabel child
      Substansi.hasMany(models.SubstansiKuliah, { foreignKey: "id_substansi" });
      Substansi.hasMany(models.PerhitunganSKS, { foreignKey: "id_substansi" });
    }
  }
  Substansi.init(
    {
      nama_substansi: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      sks_mata_kuliah: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_tatap_muka: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_praktek: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      sks_praktek_lapangan: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      sks_simulasi: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_jenis_substansi: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Substansi",
      tableName: "substansis",
    }
  );
  return Substansi;
};
