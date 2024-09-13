"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BerkasPeriodePendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      BerkasPeriodePendaftaran.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
      BerkasPeriodePendaftaran.belongsTo(models.JenisBerkas, { foreignKey: "id_jenis_berkas", as: "JenisBerkas" });

      // relasi tabel child
      BerkasPeriodePendaftaran.hasMany(models.PemberkasanCamaba, { foreignKey: "id_berkas_periode_pendaftaran" });
    }
  }
  BerkasPeriodePendaftaran.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_periode_pendaftaran: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_jenis_berkas: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "BerkasPeriodePendaftaran",
      tableName: "berkas_periode_pendaftarans"
    }
  );
  return BerkasPeriodePendaftaran;
};
