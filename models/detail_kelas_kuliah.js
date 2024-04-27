"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailKelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DetailKelasKuliah.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
    }
  }
  DetailKelasKuliah.init(
    {
      id_detail_kelas_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      bahasan: {
        type: DataTypes.STRING(200),
        allowNull: true,
      },
      tanggal_mulai_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      tanggal_akhir_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      kapasitas: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      tanggal_tutup_daftar: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      prodi_penyelenggara: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      perguruan_tinggi_penyelenggara: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DetailKelasKuliah",
      tableName: "detail_kelas_kuliahs",
    }
  );
  return DetailKelasKuliah;
};
