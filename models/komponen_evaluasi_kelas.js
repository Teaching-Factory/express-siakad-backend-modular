"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KomponenEvaluasiKelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      KomponenEvaluasiKelas.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      KomponenEvaluasiKelas.belongsTo(models.JenisEvaluasi, { foreignKey: "id_jenis_evaluasi" });

      // relasi tabel child
      KomponenEvaluasiKelas.hasMany(models.KomponenEvaluasiKelasSync, { foreignKey: "id_komponen_evaluasi" });
      KomponenEvaluasiKelas.hasMany(models.NilaiKomponenEvaluasiKelas, { foreignKey: "id_komponen_evaluasi" });
    }
  }
  KomponenEvaluasiKelas.init(
    {
      id_komponen_evaluasi: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      nama_inggris: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      nomor_urut: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      bobot_evaluasi: {
        type: DataTypes.DECIMAL(6, 4),
        allowNull: false,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_jenis_evaluasi: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "KomponenEvaluasiKelas",
      tableName: "komponen_evaluasi_kelas",
    }
  );
  return KomponenEvaluasiKelas;
};
