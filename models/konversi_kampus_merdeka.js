"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KonversiKampusMerdeka extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      KonversiKampusMerdeka.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });

      // relasi tabel child
      KonversiKampusMerdeka.belongsTo(models.AnggotaAktivitasMahasiswa, { foreignKey: "id_anggota" });
      KonversiKampusMerdeka.hasMany(models.TranskripMahasiswa, { foreignKey: "id_konversi_aktivitas" });
    }
  }
  KonversiKampusMerdeka.init(
    {
      id_konversi_aktivitas: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nilai_angka: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      nilai_indeks: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      nilai_huruf: {
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_matkul: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_anggota: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KonversiKampusMerdeka",
      tableName: "konversi_kampus_merdekas",
    }
  );
  return KonversiKampusMerdeka;
};
