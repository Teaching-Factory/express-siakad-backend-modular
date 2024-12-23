"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PesertaKelasKuliahSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      PesertaKelasKuliahSync.belongsTo(models.PesertaKelasKuliah, { foreignKey: "id_peserta_kuliah" });
    }
  }
  PesertaKelasKuliahSync.init(
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
      id_kelas_kuliah_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_registrasi_mahasiswa_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_peserta_kuliah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PesertaKelasKuliahSync",
      tableName: "peserta_kelas_kuliah_syncs",
    }
  );
  return PesertaKelasKuliahSync;
};
