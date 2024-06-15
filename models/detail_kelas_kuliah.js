"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailKelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DetailKelasKuliah.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      DetailKelasKuliah.belongsTo(models.RuangPerkuliahan, { foreignKey: "id_ruang_perkuliahan" });
    }
  }
  DetailKelasKuliah.init(
    {
      id_detail_kelas_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      bahasan: {
        type: DataTypes.STRING(200),
        allowNull: true,
        validate: {
          len: { args: [1, 200], msg: "bahasan must be between 1 and 200 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("bahasan must be a string");
          }
        },
      },
      tanggal_mulai_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      tanggal_akhir_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      kapasitas: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "kapasitas must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "kapasitas must be greater than or equal to 0",
          },
          max: {
            args: [99999],
            msg: "kapasitas must be less than or equal to 99999",
          },
        },
      },
      tanggal_tutup_daftar: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      prodi_penyelenggara: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: { args: [1, 200], msg: "prodi_penyelenggara must be between 1 and 200 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("prodi_penyelenggara must be a string");
          }
        },
      },
      perguruan_tinggi_penyelenggara: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: { args: [1, 100], msg: "perguruan_tinggi_penyelenggara must be between 1 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("perguruan_tinggi_penyelenggara must be a string");
          }
        },
      },
      // kolom tambahan
      hari: {
        type: DataTypes.ENUM(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]),
        allowNull: true,
      },
      jam_mulai: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      jam_selesai: {
        type: DataTypes.TIME,
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_kelas_kuliah must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_kelas_kuliah must be a string");
          }
        },
      },
      id_ruang_perkuliahan: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_ruang_perkuliahan must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "DetailKelasKuliah",
      tableName: "detail_kelas_kuliahs",
    }
  );
  return DetailKelasKuliah;
};
