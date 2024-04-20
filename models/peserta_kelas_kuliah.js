"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PesertaKelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PesertaKelasKuliah.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      PesertaKelasKuliah.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
    }
  }
  PesertaKelasKuliah.init(
    {
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: false,
      },
      id_kelas_kuliah: {
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
      modelName: "PesertaKelasKuliah",
      tableName: "peserta_kelas_kuliahs",
    }
  );
  return PesertaKelasKuliah;
};
