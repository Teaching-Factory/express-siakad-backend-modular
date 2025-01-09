"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MataKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      MataKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });

      // relasi tabel child
      MataKuliah.hasMany(models.MatkulKurikulum, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.KelasKuliah, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.KRSMahasiswa, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.KonversiKampusMerdeka, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.TranskripMahasiswa, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.RekapKHSMahasiswa, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.RekapKRSMahasiswa, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.PelimpahanMataKuliah, { foreignKey: "id_matkul" });
      MataKuliah.hasMany(models.RencanaEvaluasi, { foreignKey: "id_matkul" });
    }
  }
  MataKuliah.init(
    {
      id_matkul: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      tgl_create: {
        type: DataTypes.DATE, // datetime
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      jenis_mk: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      kel_mk: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      kode_mata_kuliah: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nama_mata_kuliah: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      sks_mata_kuliah: {
        type: DataTypes.DECIMAL(5, 2),
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
      id_jenis_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      id_kelompok_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      sks_tatap_muka: {
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
      metode_kuliah: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ada_sap: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      ada_silabus: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      ada_bahan_ajar: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      ada_acara_praktek: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      ada_diktat: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      tanggal_mulai_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      tanggal_selesai_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MataKuliah",
      tableName: "mata_kuliahs",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date().toISOString().slice(0, 19).replace("T", " ");
        },
      },
    }
  );
  return MataKuliah;
};
