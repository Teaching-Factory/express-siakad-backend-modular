"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenjangPendidikan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JenjangPendidikan.hasMany(models.Prodi, { foreignKey: "id_jenjang_pendidikan" });
      JenjangPendidikan.hasMany(models.Fakultas, { foreignKey: "id_jenjang_pendidikan" });
    }
  }
  JenjangPendidikan.init(
    {
      nama_jenjang_didik: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenjangPendidikan",
      tableName: "jenjang_pendidikans",
    }
  );
  return JenjangPendidikan;
};
