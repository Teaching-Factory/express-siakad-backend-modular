"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosenPengajarKelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DosenPengajarKelasKuliah.belongsTo(models.PenugasanDosen, { foreignKey: "realisasi_minggu_pertemuan" });
      DosenPengajarKelasKuliah.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      DosenPengajarKelasKuliah.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      DosenPengajarKelasKuliah.belongsTo(models.Substansi, { foreignKey: "id_substansi" });
      DosenPengajarKelasKuliah.belongsTo(models.JenisEvaluasi, { foreignKey: "id_jenis_evaluasi" });
      DosenPengajarKelasKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      DosenPengajarKelasKuliah.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  DosenPengajarKelasKuliah.init(
    {
      id_aktivitas_mengajar: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      sks_substansi_total: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      rencana_minggu_pertemuan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: false,
      },
      realisasi_minggu_pertemuan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_registrasi_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_substansi: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_jenis_evaluasi: {
        type: DataTypes.SMALLINT,
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
      modelName: "DosenPengajarKelasKuliah",
      tableName: "dosen_pengajar_kelas_kuliahs",
    }
  );
  return DosenPengajarKelasKuliah;
};
