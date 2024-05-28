"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class RuangPerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      RuangPerkuliahan.hasMany(models.DetailKelasKuliah, { foreignKey: "id_ruang_perkuliahan" });
    }
  }
  RuangPerkuliahan.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      id_ruang: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      nama_ruang_perkuliahan: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      lokasi: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "RuangPerkuliahan",
      tableName: "ruang_perkuliahans",
    }
  );
  return RuangPerkuliahan;
};
