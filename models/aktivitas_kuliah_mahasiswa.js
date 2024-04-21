"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AktivitasKuliahMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      AktivitasKuliahMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      AktivitasKuliahMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
      AktivitasKuliahMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      AktivitasKuliahMahasiswa.belongsTo(models.StatusMahasiswa, { foreignKey: "id_status_mahasiswa" });
    }
  }
  AktivitasKuliahMahasiswa.init(
    {
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: true,
      },
      ips: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      ipk: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      sks_semester: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      sks_total: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      biaya_kuliah_smt: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_status_mahasiswa: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "AktivitasKuliahMahasiswa",
      tableName: "aktivitas_kuliah_mahasiswas",
    }
  );
  return AktivitasKuliahMahasiswa;
};
