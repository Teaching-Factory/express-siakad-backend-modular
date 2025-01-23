"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RencanaEvaluasi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      RencanaEvaluasi.belongsTo(models.JenisEvaluasi, { foreignKey: "id_jenis_evaluasi" });
      RencanaEvaluasi.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });

      // relasi tabel child
      RencanaEvaluasi.hasMany(models.RencanaEvaluasiSync, { foreignKey: "id_rencana_evaluasi" });
    }
  }
  RencanaEvaluasi.init(
    {
      id_rencana_evaluasi: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama_evaluasi: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      deskripsi_indonesia: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      deskripsi_inggris: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      nomor_urut: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      bobot_evaluasi: {
        type: DataTypes.DECIMAL(6, 4),
        allowNull: true,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_jenis_evaluasi: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RencanaEvaluasi",
      tableName: "rencana_evaluasis",
    }
  );
  return RencanaEvaluasi;
};
