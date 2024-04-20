"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatusMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      StatusMahasiswa.hasMany(models.PerkuliahanMahasiswa, { foreignKey: "id_status_mahasiswa" });
      StatusMahasiswa.hasMany(models.DetailPerkuliahanMahasiswa, { foreignKey: "id_status_mahasiswa" });
      StatusMahasiswa.hasMany(models.AktivitasKuliahMahasiswa, { foreignKey: "id_status_mahasiswa" });
    }
  }
  StatusMahasiswa.init(
    {
      nama_status_mahasiswa: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StatusMahasiswa",
      tableName: "status_mahasiswas",
    }
  );
  return StatusMahasiswa;
};
