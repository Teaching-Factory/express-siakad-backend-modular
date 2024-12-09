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
      KelasKuliah.hasMany(models.PertemuanPerkuliahan, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.Kuesioner, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.KelasKuliahSync, { foreignKey: "id_kelas_kuliah" });
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
        validate: {
          len: { args: [1, 5], msg: "nama_kelas_kuliah must be between 1 and 5 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_kelas_kuliah must be a string");
          }
        },
      },
      sks: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: true,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "sks must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "sks must be greater than or equal to 0",
          },
          max: {
            args: [99999],
            msg: "sks must be less than or equal to 99999",
          },
        },
      },
      jumlah_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "jumlah_mahasiswa must be an integer",
          },
        },
      },
      apa_untuk_pditt: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "apa_untuk_pditt must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "apa_untuk_pditt must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "apa_untuk_pditt must be less than or equal to 9",
          },
        },
      },
      lingkup: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "lingkup must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "lingkup must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "lingkup must be less than or equal to 9",
          },
        },
      },
      mode: {
        type: DataTypes.CHAR(1),
        allowNull: true,
        validate: {
          len: { args: [1, 1], msg: "mode must be 1 characters" },
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
          len: { args: [1, 5], msg: "id_semester must be between 1 and 5 characters" },
        },
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_matkul must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_matkul must be a string");
          }
        },
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: true,
        // validate: {
        //   len: { args: [0, 36], msg: "id_dosen must be between 0 and 36 characters" },
        // },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_dosen must be a string");
          }
        },
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
