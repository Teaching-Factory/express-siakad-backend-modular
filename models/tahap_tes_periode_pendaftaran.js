"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TahapTesPeriodePendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      TahapTesPeriodePendaftaran.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      TahapTesPeriodePendaftaran.belongsTo(models.JenisTes, { foreignKey: "id_jenis_tes" });

      // relasi tabel child
      TahapTesPeriodePendaftaran.hasMany(models.TahapTesCamaba, { foreignKey: "id_tahap_tes_periode_pendaftaran" });
    }
  }
  TahapTesPeriodePendaftaran.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      urutan_tes: {
        type: DataTypes.ENUM(["1", "2", "3", "4", "5"]),
        allowNull: false,
      },
      tanggal_awal_tes: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_tes: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_jenis_tes: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_periode_pendaftaran: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TahapTesPeriodePendaftaran",
      tableName: "tahap_tes_periode_pendaftarans",
    }
  );
  return TahapTesPeriodePendaftaran;
};
