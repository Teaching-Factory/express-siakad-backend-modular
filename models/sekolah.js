"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Sekolah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      Sekolah.hasMany(models.BiodataCamaba, { foreignKey: "id_sekolah" });
    }
  }
  Sekolah.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4
      },
      npsn: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sekolah: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bentuk: {
        type: DataTypes.ENUM(["SMA", "SMK"]),
        allowNull: true
      },
      status: {
        type: DataTypes.CHAR,
        allowNull: true
      },
      alamat_jalan: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      lintang: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bujur: {
        type: DataTypes.STRING,
        allowNull: true
      },
      kode_kec: {
        type: DataTypes.CHAR,
        allowNull: true
      },
      kecamatan: {
        type: DataTypes.STRING,
        allowNull: true
      },
      kode_kab_kota: {
        type: DataTypes.CHAR,
        allowNull: true
      },
      kabupaten_kota: {
        type: DataTypes.STRING,
        allowNull: true
      },
      kode_prop: {
        type: DataTypes.CHAR,
        allowNull: true
      },
      propinsi: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "Sekolah",
      tableName: "sekolahs"
    }
  );
  return Sekolah;
};
