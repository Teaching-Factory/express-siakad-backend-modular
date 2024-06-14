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
      // relasi tabel parent
      AnggotaAktivitasMahasiswa.belongsTo(models.AktivitasMahasiswa, { foreignKey: "id_aktivitas" });
      AnggotaAktivitasMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });

      // relasi tabel child
      AnggotaAktivitasMahasiswa.hasMany(models.KonversiKampusMerdeka, { foreignKey: "id_anggota" });
    }
  }
  AnggotaAktivitasMahasiswa.init(
    {
      id_anggota: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      jenis_peran: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      nama_jenis_peran: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      id_aktivitas: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_registrasi_mahasiswa must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_registrasi_mahasiswa must be a string");
          }
        },
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
