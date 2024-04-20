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
      // define association here
    }
  }
  JenisAktivitasMahasiswa.init(
    {
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
