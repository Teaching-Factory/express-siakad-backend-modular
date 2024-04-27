"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisAktivitasMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisAktivitasMahasiswa.hasMany(models.AktivitasMahasiswa, { foreignKey: "id_jenis_aktivitas" });
    }
  }
  JenisAktivitasMahasiswa.init(
    {
      id_jenis_aktivitas_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(2),
      },
      nama_jenis_aktivitas_mahasiswa: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      untuk_kampus_merdeka: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "JenisAktivitasMahasiswa",
      tableName: "jenis_aktivitas_mahasiswas",
    }
  );
  return JenisAktivitasMahasiswa;
};
