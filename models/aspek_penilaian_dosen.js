"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AspekPenilaianDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      AspekPenilaianDosen.belongsTo(models.Semester, { foreignKey: "id_semester" });
    }
  }
  AspekPenilaianDosen.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nomor_urut_aspek: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      aspek_penilaian: {
        type: DataTypes.STRING(100),
        allowNull: false
      },
      tipe_aspek_penilaian: {
        type: DataTypes.ENUM(["Pilihan Ganda", "Essay"]),
        allowNull: true,
        defaultValue: "Pilihan Ganda"
      },
      deskripsi_pendek: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      tanggal_pembuatan: {
        type: DataTypes.DATE,
        allowNull: false
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "AspekPenilaianDosen",
      tableName: "aspek_penilaian_dosens"
    }
  );
  return AspekPenilaianDosen;
};
