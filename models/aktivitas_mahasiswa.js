"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AktivitasMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AktivitasMahasiswa.belongsTo(models.JenisAktivitasMahasiswa, { foreignKey: "id_jenis_aktivitas" });
      AktivitasMahasiswa.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      AktivitasMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
      AktivitasMahasiswa.hasMany(models.AnggotaAktivitasMahasiswa, { foreignKey: "id_aktivitas" });
    }
  }
  AktivitasMahasiswa.init(
    {
      jenis_anggota: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      nama_jenis_anggota: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      judul: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      keterangan: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lokasi: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      sk_tugas: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      tanggal_sk_tugas: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      untuk_kampus_merdeka: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      id_jenis_aktivitas: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "AktivitasMahasiswa",
      tableName: "aktivitas_mahasiswas",
    }
  );
  return AktivitasMahasiswa;
};
