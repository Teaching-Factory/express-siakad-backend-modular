"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ListMataKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      ListMataKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      ListMataKuliah.hasMany(models.MataKuliah, { foreignKey: "id_matkul" });
      ListMataKuliah.hasMany(models.DetailMataKuliah, { foreignKey: "id_matkul" });
      ListMataKuliah.hasMany(models.MatkulKurikulum, { foreignKey: "id_matkul" });
    }
  }
  ListMataKuliah.init(
    {
      tgl_create: {
        type: DataTypes.DATE, // datetime
        allowNull: false,
      },
      jenis_mk: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      kel_mk: {
        type: DataTypes.CHAR(1),
        allowNull: false,
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
      id_jenis_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_kelompok_mata_kuliah: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      sks_tatap_muka: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_praktek_lapangan: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_simulasi: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      metode_kuliah: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      ada_sap: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_silabus: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_bahan_ajar: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_acara_praktek: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_diktat: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
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
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "ListMataKuliah",
      tableName: "list_mata_kuliahs",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date();
        },
      },
    }
  );
  return ListMataKuliah;
};
