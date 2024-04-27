"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Periode extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Periode.belongsTo(models.Prodi, { foreignKey: "id_prodi" });

      // relasi tabel child
      Periode.hasMany(models.Mahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.RiwayatNilaiMahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.KRSMahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.RekapJumlahMahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.RekapKHSMahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.RekapKRSMahasiswa, { foreignKey: "id_periode" });
      Periode.hasMany(models.TagihanMahasiswa, { foreignKey: "id_periode" });
    }
  }
  Periode.init(
    {
      id_periode: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.CHAR(5),
      },
      periode_pelaporan: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      tipe_periode: {
        type: DataTypes.INTEGER(1),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Periode",
      tableName: "periodes",
    }
  );
  return Periode;
};
