"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PerguruanTinggi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PerguruanTinggi.hasMany(models.ProfilPT, { foreignKey: "id_perguruan_tinggi" });
      PerguruanTinggi.hasMany(models.PenugasanDosen, { foreignKey: "id_perguruan_tinggi" });
    }
  }
  PerguruanTinggi.init(
    {
      kode_perguruan_tinggi: {
        type: DataTypes.STRING(8),
        allowNull: false,
      },
      nama_perguruan_tinggi: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      nama_singkat: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PerguruanTinggi",
      tableName: "perguruan_tinggis",
    }
  );
  return PerguruanTinggi;
};
