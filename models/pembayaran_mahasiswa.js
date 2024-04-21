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
      upload_bukti_tf: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status_pembayaran: {
        type: DataTypes.ENUM("Menunggu Konfirmasi", "Dikonfirmasi", "Ditolak", "Mengirim Ulang"),
        allowNull: false,
      },
      id_tagihan_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
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
