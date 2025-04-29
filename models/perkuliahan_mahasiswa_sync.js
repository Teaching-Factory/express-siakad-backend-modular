"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerkuliahanMahasiswaSync extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi table parent
      PerkuliahanMahasiswaSync.belongsTo(models.PerkuliahanMahasiswa, { foreignKey: "id_perkuliahan_mahasiswa" });
    }
  }
  PerkuliahanMahasiswaSync.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      jenis_singkron: {
        type: DataTypes.ENUM(["get", "create", "update", "delete"]),
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      id_registrasi_mahasiswa_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_semester_feeder: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
      id_perkuliahan_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PerkuliahanMahasiswaSync",
      tableName: "perkuliahan_mahasiswa_syncs",
    }
  );
  return PerkuliahanMahasiswaSync;
};
