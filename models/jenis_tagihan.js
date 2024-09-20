"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisTagihan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisTagihan.hasMany(models.TagihanMahasiswa, { foreignKey: "id_jenis_tagihan" });
      JenisTagihan.hasMany(models.TagihanCamaba, { foreignKey: "id_jenis_tagihan" });
    }
  }
  JenisTagihan.init(
    {
      id_jenis_tagihan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10)
      },
      nama_jenis_tagihan: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "JenisTagihan",
      tableName: "jenis_tagihans"
    }
  );
  return JenisTagihan;
};
