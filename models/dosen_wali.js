"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DosenWali extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DosenWali.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      DosenWali.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      DosenWali.belongsTo(models.TahunAjaran, { foreignKey: "id_tahun_ajaran" });
    }
  }
  DosenWali.init(
    {
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_tahun_ajaran: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DosenWali",
      tableName: "dosen_walis",
    }
  );
  return DosenWali;
};
