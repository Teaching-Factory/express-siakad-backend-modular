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
      DosenPengajarKelasKuliah.belongsTo(models.PenugasanDosen, { foreignKey: "id_registrasi_dosen" });
      DosenPengajarKelasKuliah.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      DosenPengajarKelasKuliah.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      DosenPengajarKelasKuliah.belongsTo(models.Substansi, { foreignKey: "id_substansi" });
      DosenPengajarKelasKuliah.belongsTo(models.JenisEvaluasi, { foreignKey: "id_jenis_evaluasi" });
      DosenPengajarKelasKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      DosenPengajarKelasKuliah.belongsTo(models.Semester, { foreignKey: "id_semester" });

      // relasi tabel child
      DosenPengajarKelasKuliah.hasMany(models.DosenPengajarKelasKuliahSync, { foreignKey: "id_aktivitas_mengajar" });
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
        validate: {
          isDecimal: {
            args: true,
            msg: "sks_substansi_total must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "sks_substansi_total must be greater than or equal to 0",
          },
          max: {
            args: [999.99],
            msg: "sks_substansi_total must be less than or equal to 999.99",
          },
        },
      },
      rencana_minggu_pertemuan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: false,
        validate: {
          isDecimal: {
            args: true,
            msg: "rencana_minggu_pertemuan must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "rencana_minggu_pertemuan must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "rencana_minggu_pertemuan must be less than or equal to 99",
          },
        },
      },
      realisasi_minggu_pertemuan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "realisasi_minggu_pertemuan must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "realisasi_minggu_pertemuan must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "realisasi_minggu_pertemuan must be less than or equal to 99",
          },
        },
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_registrasi_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
        validate: {
          len: { args: [1, 36], msg: "id_registrasi_dosen must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_registrasi_dosen must be a string");
          }
        },
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
        validate: {
          len: { args: [1, 36], msg: "id_dosen must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_dosen must be a string");
          }
        },
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: true,
        validate: {
          len: { args: [1, 36], msg: "id_kelas_kuliah must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_kelas_kuliah must be a string");
          }
        },
      },
      id_substansi: {
        type: DataTypes.STRING(36),
        allowNull: true,
        validate: {
          len: { args: [1, 36], msg: "id_substansi must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_substansi must be a string");
          }
        },
      },
      id_jenis_evaluasi: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_prodi must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_prodi must be a string");
          }
        },
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
        validate: {
          len: { args: [1, 5], msg: "mode must be between 1 and 5 characters" },
        },
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
