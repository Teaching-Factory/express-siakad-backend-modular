"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KRSMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      KRSMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      KRSMahasiswa.belongsTo(models.Periode, { foreignKey: "id_periode" });
      KRSMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      KRSMahasiswa.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      KRSMahasiswa.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas" });

      // relasi tabel child
      KRSMahasiswa.hasMany(models.MatkulKRS, { foreignKey: "id_krs" });
    }
  }
  KRSMahasiswa.init(
    {
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_periode: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_kelas: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KRSMahasiswa",
      tableName: "krs_mahasiswas",
    }
  );
  return KRSMahasiswa;
};
