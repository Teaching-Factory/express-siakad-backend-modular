"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      KelasKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      KelasKuliah.belongsTo(models.Semester, { foreignKey: "id_semester" });
      KelasKuliah.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      KelasKuliah.belongsTo(models.Dosen, { foreignKey: "id_dosen" });

      // relasi tabel child
      KelasKuliah.hasMany(models.DetailKelasKuliah, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.PerhitunganSKS, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.DetailNilaiPerkuliahanKelas, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.RiwayatNilaiMahasiswa, { foreignKey: "id_kelas" });
      KelasKuliah.hasMany(models.PesertaKelasKuliah, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.KRSMahasiswa, { foreignKey: "id_kelas" });
      KelasKuliah.hasMany(models.TranskripMahasiswa, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.DosenPengajarKelasKuliah, { foreignKey: "id_kelas_kuliah" });
    }
  }
  KelasKuliah.init(
    {
      id_kelas_kuliah: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama_kelas_kuliah: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      sks: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      jumlah_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      apa_untuk_pditt: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      lingkup: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      mode: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KelasKuliah",
      tableName: "kelas_kuliahs",
    }
  );
  return KelasKuliah;
};
