"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProfilPT extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      ProfilPT.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi" });
      ProfilPT.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
    }
  }
  ProfilPT.init(
    {
      id_profil_pt: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
        autoIncrement: true,
      },
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: { args: [1, 20], msg: "telepon must be between 1 and 20 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("telepon must be a string");
          }
        },
      },
      faximile: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: { args: [1, 20], msg: "faximile must be between 1 and 20 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("faximile must be a string");
          }
        },
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
        validate: {
          len: { args: [1, 60], msg: "email must be between 1 and 60 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("email must be a string");
          }
        },
      },
      website: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: { args: [1, 255], msg: "website must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("website must be a string");
          }
        },
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: true,
        validate: {
          len: { args: [1, 80], msg: "jalan must be between 1 and 80 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("jalan must be a string");
          }
        },
      },
      dusun: {
        type: DataTypes.STRING(60),
        allowNull: true,
        validate: {
          len: { args: [1, 60], msg: "dusun must be between 1 and 60 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("dusun must be a string");
          }
        },
      },
      rt_rw: {
        type: DataTypes.STRING(7),
        allowNull: true,
        validate: {
          len: { args: [1, 7], msg: "rt_rw must be between 1 and 7 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("rt_rw must be a string");
          }
        },
      },
      kelurahan: {
        type: DataTypes.STRING(60),
        allowNull: false,
        validate: {
          len: { args: [1, 60], msg: "kelurahan must be between 1 and 60 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("kelurahan must be a string");
          }
        },
      },
      kode_pos: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "kode_pos must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "kode_pos must be greater than or equal to 0",
          },
          max: {
            args: [99999],
            msg: "kode_pos must be less than or equal to 99999",
          },
        },
      },
      lintang_bujur: {
        type: DataTypes.STRING(24),
        allowNull: true,
        validate: {
          len: { args: [1, 24], msg: "lintang_bujur must be between 1 and 24 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("lintang_bujur must be a string");
          }
        },
      },
      bank: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: { args: [1, 50], msg: "bank must be between 1 and 50 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("bank must be a string");
          }
        },
      },
      unit_cabang: {
        type: DataTypes.STRING(60),
        allowNull: true,
        validate: {
          len: { args: [1, 60], msg: "unit_cabang must be between 1 and 60 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("unit_cabang must be a string");
          }
        },
      },
      nomor_rekening: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: { args: [1, 20], msg: "nomor_rekening must be between 1 and 20 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nomor_rekening must be a string");
          }
        },
      },
      mbs: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "mbs must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "mbs must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "mbs must be less than or equal to 9",
          },
        },
      },
      luas_tanah_milik: {
        type: DataTypes.DECIMAL(7, 0),
        allowNull: false,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "luas_tanah_milik must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "luas_tanah_milik must be greater than or equal to 0",
          },
          max: {
            args: [9999999],
            msg: "luas_tanah_milik must be less than or equal to 9999999",
          },
        },
      },
      luas_tanah_bukan_milik: {
        type: DataTypes.DECIMAL(7, 0),
        allowNull: false,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "luas_tanah_bukan_milik must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "luas_tanah_bukan_milik must be greater than or equal to 0",
          },
          max: {
            args: [9999999],
            msg: "luas_tanah_bukan_milik must be less than or equal to 9999999",
          },
        },
      },
      sk_pendirian: {
        type: DataTypes.STRING(80),
        allowNull: true,
        validate: {
          len: { args: [1, 80], msg: "sk_pendirian must be between 1 and 80 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("sk_pendirian must be a string");
          }
        },
      },
      tanggal_sk_pendirian: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        isDate: true,
      },
      id_status_milik: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
        isDecimal: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_status_milik must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_status_milik must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "id_status_milik must be less than or equal to 9",
          },
        },
      },
      nama_status_milik: {
        type: DataTypes.STRING(50),
        allowNull: true,
        validate: {
          len: { args: [1, 50], msg: "nama_status_milik must be between 1 and 50 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_status_milik must be a string");
          }
        },
      },
      status_perguruan_tinggi: {
        type: DataTypes.CHAR(1),
        allowNull: false,
        validate: {
          len: { args: [1, 1], msg: "status_perguruan_tinggi must be 1 characters" },
        },
      },
      sk_izin_operasional: {
        type: DataTypes.STRING(80),
        allowNull: true,
        validate: {
          len: { args: [1, 80], msg: "sk_izin_operasional must be between 1 and 80 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("sk_izin_operasional must be a string");
          }
        },
      },
      tanggal_izin_operasional: {
        type: DataTypes.DATEONLY,
        allowNull: true,
        isDate: true,
      },
      id_perguruan_tinggi: {
        type: DataTypes.STRING(36),
        allowNull: true,
        validate: {
          len: { args: [1, 36], msg: "id_perguruan_tinggi must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_perguruan_tinggi must be a string");
          }
        },
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: true,
        validate: {
          len: { args: [1, 8], msg: "id_wilayah must be between 1 and 8 characters" },
        },
      },
    },
    {
      sequelize,
      modelName: "ProfilPT",
      tableName: "profil_pts",
    }
  );
  return ProfilPT;
};
