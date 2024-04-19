"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Agama extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Agama.hasMany(models.Dosen, { foreignKey: "id_agama" });
      Agama.hasMany(models.Mahasiswa, { foreignKey: "id_agama" });
    }
  }
  Agama.init(
    {
      nama_agama: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Agama",
      tableName: "agamas",
    }
  );
  return Agama;
};
