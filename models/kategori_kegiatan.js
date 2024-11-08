"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KategoriKegiatan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      KategoriKegiatan.hasMany(models.MahasiswaBimbinganDosen, { foreignKey: "id_kategori_kegiatan" });
      KategoriKegiatan.hasMany(models.UjiMahasiswa, { foreignKey: "id_kategori_kegiatan" });
    }
  }
  KategoriKegiatan.init(
    {
      id_kategori_kegiatan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nama_kategori_kegiatan: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KategoriKegiatan",
      tableName: "kategori_kegiatans",
    }
  );
  return KategoriKegiatan;
};
