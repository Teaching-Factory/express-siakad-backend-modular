"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AnggotaAktivitasMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AnggotaAktivitasMahasiswa.belongsTo(models.AktivitasMahasiswa, { foreignKey: "id_aktivitas" });
      AnggotaAktivitasMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      AnggotaAktivitasMahasiswa.hasMany(models.KonversiKampusMerdeka, { foreignKey: "id_anggota" });
    }
  }
  AnggotaAktivitasMahasiswa.init(
    {
      jenis_peran: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      nama_jenis_peran: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      id_aktivitas: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AnggotaAktivitasMahasiswa",
      tableName: "anggota_aktivitas_mahasiswas",
    }
  );
  return AnggotaAktivitasMahasiswa;
};
