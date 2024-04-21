"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TahunAjaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      TahunAjaran.hasMany(models.Semester, { foreignKey: "id_tahun_ajaran" });
      TahunAjaran.hasMany(models.PenugasanDosen, { foreignKey: "id_tahun_ajaran" });
    }
  }
  TahunAjaran.init(
    {
      nama_tahun_ajaran: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      a_periode: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
      },
      tanggal_mulai: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      tanggal_selesai: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "TahunAjaran",
      tableName: "tahun_ajarans",
    }
  );
  return TahunAjaran;
};
