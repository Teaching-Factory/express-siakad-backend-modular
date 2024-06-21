"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PembayaranMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PembayaranMahasiswa.belongsTo(models.TagihanMahasiswa, { foreignKey: "id_tagihan_mahasiswa" });
    }
  }
  PembayaranMahasiswa.init(
    {
      id_pembayaran_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      upload_bukti_tf: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status_pembayaran: {
        type: DataTypes.ENUM("Menunggu Konfirmasi", "Dikonfirmasi", "Ditolak", "Mengirim Ulang"),
        allowNull: false,
      },
      id_tagihan_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_tagihan_mahasiswa must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_tagihan_mahasiswa must be a string");
          }
        },
      },
    },
    {
      sequelize,
      modelName: "PembayaranMahasiswa",
      tableName: "pembayaran_mahasiswas",
    }
  );
  return PembayaranMahasiswa;
};
