"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Semester.belongsTo(models.TahunAjaran, { foreignKey: "id_tahun_ajaran" });

      // relasi tabel child
      Semester.hasMany(models.KRSMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.Kurikulum, { foreignKey: "id_semester" });
      Semester.hasMany(models.KelasKuliah, { foreignKey: "id_semester" });
      Semester.hasMany(models.Mahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_periode_masuk" });
      Semester.hasMany(models.PerkuliahanMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.DetailPerkuliahanMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.PeriodePerkuliahan, { foreignKey: "id_semester" });
      Semester.hasMany(models.DetailPeriodePerkuliahan, { foreignKey: "id_semester" });
      Semester.hasMany(models.AktivitasKuliahMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_periode_masuk" });
      Semester.hasMany(models.AktivitasMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.RekapKRSMahasiswa, { foreignKey: "id_semester" });
      Semester.hasMany(models.DosenPengajarKelasKuliah, { foreignKey: "id_semester" });
      Semester.hasMany(models.SettingGlobalSemester, { foreignKey: "id_semester_aktif" });
      Semester.hasMany(models.SettingGlobalSemester, { foreignKey: "id_semester_nilai" });
      Semester.hasMany(models.SettingGlobalSemester, { foreignKey: "id_semester_krs" });
      Semester.hasMany(models.PeriodePendaftaran, { foreignKey: "id_semester" });
      Semester.hasMany(models.PeriodeYudisium, { foreignKey: "id_semester" });
      Semester.hasMany(models.AspekPenilaianDosen, { foreignKey: "id_semester" });
      Semester.hasMany(models.SkalaPenilaianDosen, { foreignKey: "id_semester" });
    }
  }
  Semester.init(
    {
      id_semester: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.CHAR(5)
      },
      nama_semester: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      semester: {
        type: DataTypes.INTEGER(1),
        allowNull: false
      },
      id_tahun_ajaran: {
        type: DataTypes.INTEGER(4),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Semester",
      tableName: "semesters"
    }
  );
  return Semester;
};
