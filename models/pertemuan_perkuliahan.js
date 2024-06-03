"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PertemuanPerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PertemuanPerkuliahan.belongsTo(models.RuangPerkuliahan, { foreignKey: "id_ruang_perkuliahan" });
      PertemuanPerkuliahan.belongsTo(models.KelasKuliah, { foreignKey: "id_kelas_kuliah" });

      // relasi tabel child
      PertemuanPerkuliahan.hasMany(models.PresensiMahasiswa, { foreignKey: "id_pertemuan_perkuliahan" });
    }
  }
  PertemuanPerkuliahan.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      pertemuan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      tanggal_pertemuan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      waktu_mulai: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      waktu_selesai: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      materi: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      jumlah_mahasiswa_hadir: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
        defaultValue: 0,
      },
      kunci_pertemuan: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      id_ruang_perkuliahan: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_kelas_kuliah: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "PertemuanPerkuliahan",
      tableName: "pertemuan_perkuliahans",
    }
  );
  return PertemuanPerkuliahan;
};
