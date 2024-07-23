"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailNilaiPerkuliahanKelas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DetailNilaiPerkuliahanKelas.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });
      DetailNilaiPerkuliahanKelas.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });

      // relasi tabel child
      DetailNilaiPerkuliahanKelas.hasMany(models.NilaiPerkuliahan, { foreignKey: "id_detail_nilai_perkuliahan_kelas" });
    }
  }
  DetailNilaiPerkuliahanKelas.init(
    {
      id_detail_nilai_perkuliahan_kelas: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      jurusan: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      angkatan: {
        type: DataTypes.STRING(4),
        allowNull: false,
      },
      nilai_angka: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
      },
      nilai_indeks: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
      },
      nilai_huruf: {
        type: DataTypes.CHAR(3),
        allowNull: true,
      },
      id_kelas_kuliah: {
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
      modelName: "DetailNilaiPerkuliahanKelas",
      tableName: "detail_nilai_perkuliahan_kelas",
    }
  );
  return DetailNilaiPerkuliahanKelas;
};
