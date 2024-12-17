"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RiwayatPendidikanMahasiswaSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      RiwayatPendidikanMahasiswaSync.belongsTo(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_riwayat_pend_mhs" });
    }
  }
  RiwayatPendidikanMahasiswaSync.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jenis_singkron: {
        type: DataTypes.ENUM(["create", "update", "delete"]),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_riwayat_pend_mhs: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "RiwayatPendidikanMahasiswaSync",
      tableName: "riwayat_pendidikan_mahasiswa_syncs",
    }
  );
  return RiwayatPendidikanMahasiswaSync;
};
