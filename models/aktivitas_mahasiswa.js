"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AktivitasMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      AktivitasMahasiswa.belongsTo(models.JenisAktivitasMahasiswa, { foreignKey: "id_jenis_aktivitas" });
      AktivitasMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      AktivitasMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });

      // relasi tabel child
      AktivitasMahasiswa.hasMany(models.AnggotaAktivitasMahasiswa, { foreignKey: "id_aktivitas" });
      AktivitasMahasiswa.hasMany(models.MahasiswaBimbinganDosen, { foreignKey: "id_aktivitas" });
      AktivitasMahasiswa.hasMany(models.UjiMahasiswa, { foreignKey: "id_aktivitas" });
    }
  }
  AktivitasMahasiswa.init(
    {
      id_aktivitas: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      jenis_anggota: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "jenis_anggota must be an integer",
          },
        },
      },
      nama_jenis_anggota: {
        type: DataTypes.STRING(10),
        allowNull: true,
        validate: {
          len: { args: [1, 10], msg: "nama_jenis_anggota must be between 1 and 10 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_jenis_anggota must be a string");
          }
        },
      },
      judul: {
        type: DataTypes.STRING(500),
        allowNull: false,
        validate: {
          len: { args: [1, 500], msg: "judul must be between 1 and 500 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("judul must be a string");
          }
        },
      },
      keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lokasi: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: { args: [1, 255], msg: "lokasi must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("lokasi must be a string");
          }
        },
      },
      sk_tugas: {
        type: DataTypes.STRING(255),
        allowNull: true,
        validate: {
          len: { args: [1, 255], msg: "sk_tugas must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("sk_tugas must be a string");
          }
        },
      },
      tanggal_sk_tugas: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      untuk_kampus_merdeka: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "untuk_kampus_merdeka must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "untuk_kampus_merdeka must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "untuk_kampus_merdeka must be less than or equal to 9",
          },
        },
      },
      id_jenis_aktivitas: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "id_jenis_aktivitas must be an integer",
          },
        },
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
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_semester must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "AktivitasMahasiswa",
      tableName: "aktivitas_mahasiswas",
    }
  );
  return AktivitasMahasiswa;
};
