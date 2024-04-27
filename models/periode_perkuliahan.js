"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PeriodePerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PeriodePerkuliahan.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      PeriodePerkuliahan.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  PeriodePerkuliahan.init(
    {
      id_periode_perkuliahan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      jumlah_target_mahasiswa_baru: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      tanggal_awal_perkuliahan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_perkuliahan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      calon_ikut_seleksi: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      calon_lulus_seleksi: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      daftar_sbg_mhs: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      pst_undur_diri: {
        type: DataTypes.DECIMAL(6, 0),
        allowNull: true,
      },
      jml_mgu_kul: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      metode_kul: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      metode_kul_eks: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      tgl_create: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      last_update: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PeriodePerkuliahan",
      tableName: "periode_perkuliahans",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date().toISOString().split("T")[0];
        },
        beforeUpdate: (instance, options) => {
          instance.last_update = new Date().toISOString().split("T")[0];
        },
      },
    }
  );
  return PeriodePerkuliahan;
};
