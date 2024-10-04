"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Kuesioner extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Kuesioner.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      Kuesioner.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      Kuesioner.belongsTo(models.AspekPenilaianDosen, { foreignKey: "id_aspek_penilaian_dosen" });
      Kuesioner.belongsTo(models.SkalaPenilaianDosen, { foreignKey: "id_skala_penilaian_dosen" });
    }
  }
  Kuesioner.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_aspek_penilaian_dosen: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_skala_penilaian_dosen: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Kuesioner",
      tableName: "kuesioners"
    }
  );
  return Kuesioner;
};
