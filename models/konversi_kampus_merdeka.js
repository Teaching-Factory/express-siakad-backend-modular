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
      KonversiKampusMerdeka.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      KonversiKampusMerdeka.belongsTo(models.AnggotaAktivitasMahasiswa, { foreignKey: "id_anggota" });
      KonversiKampusMerdeka.hasMany(models.TranskripMahasiswa, { foreignKey: "id_konversi_aktivitas" });
    }
  }
  KonversiKampusMerdeka.init(
    {
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
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_anggota: {
        type: DataTypes.STRING(32),
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
