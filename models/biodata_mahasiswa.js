"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BiodataMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      BiodataMahasiswa.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
      BiodataMahasiswa.belongsTo(models.JenisTinggal, { foreignKey: "id_jenis_tinggal" });
      BiodataMahasiswa.belongsTo(models.AlatTransportasi, { foreignKey: "id_alat_transportasi" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ayah" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ayah" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ayah" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ibu" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ibu" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ibu" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_wali" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_wali" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_wali" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_mahasiswa" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ayah" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ibu" });

      // relasi tabel child
      BiodataMahasiswa.hasMany(models.Mahasiswa, { foreignKey: "id_mahasiswa" });
      BiodataMahasiswa.hasMany(models.BiodataMahasiswaSync, { foreignKey: "id_mahasiswa" });
    }
  }
  BiodataMahasiswa.init(
    {
      id_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      tempat_lahir: {
        type: DataTypes.STRING(32),
        allowNull: false,
        validate: {
          len: { args: [1, 32], msg: "tempat_lahir must be between 1 and 32 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("tempat_lahir must be a string");
          }
        },
      },
      nik: {
        type: DataTypes.CHAR(18),
        allowNull: true,
        validate: {
          len: { args: [0, 18], msg: "nik must be between 0 and 18 characters" },
        },
      },
      nisn: {
        type: DataTypes.CHAR(10),
        allowNull: true,
        validate: {
          len: { args: [1, 10], msg: "nisn must be between 1 and 10 characters" },
        },
      },
      npwp: {
        type: DataTypes.CHAR(15),
        allowNull: true,
        validate: {
          len: { args: [1, 15], msg: "npwp must be between 1 and 15 characters" },
        },
      },
      kewarganegaraan: {
        type: DataTypes.CHAR(20),
        allowNull: false,
        validate: {
          len: { args: [1, 20], msg: "kewarganegaraan must be between 1 and 20 characters" },
        },
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: true,
        validate: {
          len: { args: [0, 80], msg: "jalan must be between 0 and 80 characters" },
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
      rt: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "rt must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "rt must be greater than or equal to 0",
          },
          max: {
            args: [999],
            msg: "rt must be less than or equal to 999",
          },
        },
      },
      rw: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "rw must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "rw must be greater than or equal to 0",
          },
          max: {
            args: [999],
            msg: "rw must be less than or equal to 999",
          },
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
        // validate: {
        //   isDecimal: {
        //     args: true,
        //     msg: "kode_pos must be a valid decimal number",
        //   },
        //   min: {
        //     args: [0],
        //     msg: "kode_pos must be greater than or equal to 0",
        //   },
        //   max: {
        //     args: [99999],
        //     msg: "kode_pos must be less than or equal to 9",
        //   },
        // },
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
      handphone: {
        type: DataTypes.STRING(20),
        allowNull: true,
        validate: {
          len: { args: [1, 20], msg: "handphone must be between 1 and 20 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("handphone must be a string");
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
      penerima_kps: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
        validate: {
          isDecimal: {
            args: true,
            msg: "penerima_kps must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "penerima_kps must be greater than or equal to 0",
          },
          max: {
            args: [9],
            msg: "penerima_kps must be less than or equal to 9",
          },
        },
      },
      nomor_kps: {
        type: DataTypes.STRING(80),
        allowNull: true,
        validate: {
          len: { args: [1, 80], msg: "nomor_kps must be between 1 and 80 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nomor_kps must be a string");
          }
        },
      },
      nik_ayah: {
        type: DataTypes.CHAR(16),
        allowNull: true,
        validate: {
          len: { args: [1, 16], msg: "nik_ayah must be between 1 and 16 characters" },
        },
      },
      nama_ayah: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: { args: [1, 100], msg: "nama_ayah must be between 1 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_ayah must be a string");
          }
        },
      },
      tanggal_lahir_ayah: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nik_ibu: {
        type: DataTypes.CHAR(16),
        allowNull: true,
        validate: {
          len: { args: [1, 16], msg: "nik_ibu must be between 1 and 16 characters" },
        },
      },
      nama_ibu_kandung: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: { args: [0, 100], msg: "nama_ibu_kandung must be between 0 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_ibu_kandung must be a string");
          }
        },
      },
      tanggal_lahir_ibu: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nama_wali: {
        type: DataTypes.STRING(100),
        allowNull: true,
        validate: {
          len: { args: [1, 100], msg: "nama_wali must be between 1 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("nama_wali must be a string");
          }
        },
      },
      tanggal_lahir_wali: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: true,
        validate: {
          len: { args: [1, 8], msg: "id_wilayah must be between 1 and 8 characters" },
        },
      },
      id_jenis_tinggal: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_jenis_tinggal must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_jenis_tinggal must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "id_jenis_tinggal must be less than or equal to 9",
          },
        },
      },
      id_alat_transportasi: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_alat_transportasi must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_alat_transportasi must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "id_alat_transportasi must be less than or equal to 9",
          },
        },
      },
      id_pendidikan_ayah: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_pendidikan_ayah must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_pendidikan_ayah must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "id_pendidikan_ayah must be less than or equal to 9",
          },
        },
      },
      id_pekerjaan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_pekerjaan_ayah must be an integer",
          },
        },
      },
      id_penghasilan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_penghasilan_ayah must be an integer",
          },
        },
      },
      id_pendidikan_ibu: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_pendidikan_ibu must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_pendidikan_ibu must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "id_pendidikan_ibu must be less than or equal to 9",
          },
        },
      },
      id_pekerjaan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_pekerjaan_ibu must be an integer",
          },
        },
      },
      id_penghasilan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_penghasilan_ibu must be an integer",
          },
        },
      },
      id_pendidikan_wali: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
        validate: {
          isDecimal: {
            args: true,
            msg: "id_pendidikan_wali must be a valid decimal number",
          },
          min: {
            args: [0],
            msg: "id_pendidikan_wali must be greater than or equal to 0",
          },
          max: {
            args: [99],
            msg: "id_pendidikan_wali must be less than or equal to 9",
          },
        },
      },
      id_pekerjaan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_pekerjaan_wali must be an integer",
          },
        },
      },
      id_penghasilan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_penghasilan_wali must be an integer",
          },
        },
      },
      id_kebutuhan_khusus_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_kebutuhan_khusus_mahasiswa must be an integer",
          },
        },
      },
      id_kebutuhan_khusus_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_kebutuhan_khusus_ayah must be an integer",
          },
        },
      },
      id_kebutuhan_khusus_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
        validate: {
          isInt: {
            args: true,
            msg: "id_kebutuhan_khusus_ibu must be an integer",
          },
        },
      },
    },
    {
      sequelize,
      modelName: "BiodataMahasiswa",
      tableName: "biodata_mahasiswas",
    }
  );
  return BiodataMahasiswa;
};
