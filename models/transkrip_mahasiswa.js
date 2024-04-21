"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TranskripMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TranskripMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      TranskripMahasiswa.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      TranskripMahasiswa.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      TranskripMahasiswa.belongsTo(models.KonversiKampusMerdeka, { foreignKey: "id_konversi_aktivitas" });
    }
  }
  TranskripMahasiswa.init(
    {
      smt_diambil: {
        type: DataTypes.INTEGER(2),
        allowNull: true,
      },
      id_nilai_transfer: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_konversi_aktivitas: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "TranskripMahasiswa",
      tableName: "transkrip_mahasiswas",
    }
  );
  return TranskripMahasiswa;
};
