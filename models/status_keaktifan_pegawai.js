"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class StatusKeaktifanPegawai extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      StatusKeaktifanPegawai.hasMany(models.Dosen, { foreignKey: "id_status_aktif" });
    }
  }
  StatusKeaktifanPegawai.init(
    {
      id_status_aktif: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(2),
      },
      nama_status_aktif: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "StatusKeaktifanPegawai",
      tableName: "status_keaktifan_pegawais",
    }
  );
  return StatusKeaktifanPegawai;
};
