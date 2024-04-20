"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerkuliahanMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PerkuliahanMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      PerkuliahanMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
      PerkuliahanMahasiswa.belongsTo(models.StatusMahasiswa, { foreignKey: "id_status_mahasiswa" });
      PerkuliahanMahasiswa.belongsTo(models.Pembiayaan, { foreignKey: "id_pembiayaan" });
    }
  }
  PerkuliahanMahasiswa.init(
    {
      angkatan: {
        type: DataTypes.CHAR(4),
        allowNull: true,
      },
      ips: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      ipk: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      sks_semester: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      sks_total: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      biaya_kuliah_smt: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_status_mahasiswa: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      id_pembiayaan: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      allowNull: false,

      sequelize,
      modelName: "PerkuliahanMahasiswa",
      tableName: "perkuliahan_mahasiswas",
    }
  );
  return PerkuliahanMahasiswa;
};
