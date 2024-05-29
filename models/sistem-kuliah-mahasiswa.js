"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SistemKuliahMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SistemKuliahMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
    }
  }
  SistemKuliahMahasiswa.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_sistem_kuliah: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SistemKuliahMahasiswa",
      tableName: "sistem_kuliah_mahasiswas",
    }
  );
  return SistemKuliahMahasiswa;
};
