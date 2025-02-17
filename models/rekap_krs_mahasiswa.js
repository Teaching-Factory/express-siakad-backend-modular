"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RekapKRSMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      RekapKRSMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      RekapKRSMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      RekapKRSMahasiswa.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      RekapKRSMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  RekapKRSMahasiswa.init(
    {
      id_rekap_krs_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_matkul: {
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
      modelName: "RekapKRSMahasiswa",
      tableName: "rekap_krs_mahasiswas",
    }
  );
  return RekapKRSMahasiswa;
};
