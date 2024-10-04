"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SkalaPenilaianDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SkalaPenilaianDosen.belongsTo(models.Semester, { foreignKey: "id_semester" });

      // relasi tabel child
      SkalaPenilaianDosen.hasMany(models.Kuesioner, { foreignKey: "id_skala_penilaian_dosen" });
    }
  }
  SkalaPenilaianDosen.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      keterangan_skala_penilaian: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      poin_skala_penilaian: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "SkalaPenilaianDosen",
      tableName: "skala_penilaian_dosens"
    }
  );
  return SkalaPenilaianDosen;
};
