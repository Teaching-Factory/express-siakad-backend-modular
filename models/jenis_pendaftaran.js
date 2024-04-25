"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisPendaftaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisPendaftaran.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_jenis_daftar" });
    }
  }
  JenisPendaftaran.init(
    {
      id_jenis_daftar: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.DECIMAL(2, 0),
      },
      nama_jenis_daftar: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      untuk_daftar_sekolah: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisPendaftaran",
      tableName: "jenis_pendaftarans",
    }
  );
  return JenisPendaftaran;
};
