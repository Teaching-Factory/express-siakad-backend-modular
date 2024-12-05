"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosenPengajarKelasKuliahSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      DosenPengajarKelasKuliahSync.belongsTo(models.DosenPengajarKelasKuliah, { foreignKey: "id_aktivitas_mengajar" });
    }
  }
  DosenPengajarKelasKuliahSync.init(
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
      id_aktivitas_mengajar: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DosenPengajarKelasKuliahSync",
      tableName: "dosen_pengajar_kelas_kuliah_syncs",
    }
  );
  return DosenPengajarKelasKuliahSync;
};
