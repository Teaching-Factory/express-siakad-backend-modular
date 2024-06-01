"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class MahasiswaBimbinganDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      MahasiswaBimbinganDosen.belongsTo(models.AktivitasMahasiswa, { foreignKey: "id_aktivitas" });
      MahasiswaBimbinganDosen.belongsTo(models.KategoriKegiatan, { foreignKey: "id_kategori_kegiatan" });
      MahasiswaBimbinganDosen.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
    }
  }
  MahasiswaBimbinganDosen.init(
    {
      id_bimbing_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      pembimbing_ke: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_aktivitas: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_kategori_kegiatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "MahasiswaBimbinganDosen",
      tableName: "mahasiswa_bimbingan_dosens",
    }
  );
  return MahasiswaBimbinganDosen;
};
