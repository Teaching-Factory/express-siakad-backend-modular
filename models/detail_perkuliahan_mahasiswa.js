"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailPerkuliahanMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DetailPerkuliahanMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      DetailPerkuliahanMahasiswa.belongsTo(models.Semester, { foreignKey: "id_semester" });
      DetailPerkuliahanMahasiswa.belongsTo(models.StatusMahasiswa, { foreignKey: "id_status_mahasiswa" });
    }
  }
  DetailPerkuliahanMahasiswa.init(
    {
      id_detail_perkuliahan_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
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
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
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
    },
    {
      sequelize,
      modelName: "DetailPerkuliahanMahasiswa",
      tableName: "detail_perkuliahan_mahasiswas",
    }
  );
  return DetailPerkuliahanMahasiswa;
};
