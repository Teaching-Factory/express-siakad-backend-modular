"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailNilaiPerkuliahanKelasSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      DetailNilaiPerkuliahanKelasSync.belongsTo(models.DetailNilaiPerkuliahanKelas, { foreignKey: "id_detail_nilai_perkuliahan_kelas" });
    }
  }
  DetailNilaiPerkuliahanKelasSync.init(
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
      id_detail_nilai_perkuliahan_kelas: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DetailNilaiPerkuliahanKelasSync",
      tableName: "detail_nilai_perkuliahan_kelas_syncs",
    }
  );
  return DetailNilaiPerkuliahanKelasSync;
};
