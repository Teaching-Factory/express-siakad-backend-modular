"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NilaiKomponenEvaluasiKelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      NilaiKomponenEvaluasiKelas.belongsTo(models.KomponenEvaluasiKelas, { foreignKey: "id_komponen_evaluasi" });
      NilaiKomponenEvaluasiKelas.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
    }
  }
  NilaiKomponenEvaluasiKelas.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      nilai_komponen_evaluasi_kelas: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 0,
      },
      id_komponen_evaluasi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "NilaiKomponenEvaluasiKelas",
      tableName: "nilai_komponen_evaluasi_kelas",
    }
  );
  return NilaiKomponenEvaluasiKelas;
};
