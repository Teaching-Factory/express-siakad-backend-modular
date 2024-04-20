"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RiwayatNilaiMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RiwayatNilaiMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      RiwayatNilaiMahasiswa.belongsTo(models.Periode, { foreignKey: "id_periode" });
      RiwayatNilaiMahasiswa.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas" });
    }
  }
  RiwayatNilaiMahasiswa.init(
    {
      nilai_angka: {
        type: DataTypes.DECIMAL(4, 1),
        allowNull: true,
      },
      nilai_huruf: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
      nilai_indeks: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
      },
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_periode: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_kelas: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RiwayatNilaiMahasiswa",
      tableName: "riwayat_nilai_mahasiswas",
    }
  );
  return RiwayatNilaiMahasiswa;
};
