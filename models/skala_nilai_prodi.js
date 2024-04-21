"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SkalaNilaiProdi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SkalaNilaiProdi.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  SkalaNilaiProdi.init(
    {
      tgl_create: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      nilai_huruf: {
        type: DataTypes.CHAR(3),
        allowNull: false,
      },
      nilai_indeks: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: false,
      },
      bobot_minimum: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      bobot_maksimum: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
      },
      tanggal_mulai_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_efektif: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SkalaNilaiProdi",
      tableName: "skala_nilai_prodis",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date().toISOString().slice(0, 19).replace("T", " ");
        },
      },
    }
  );
  return SkalaNilaiProdi;
};
