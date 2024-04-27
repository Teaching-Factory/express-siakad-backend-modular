("use strict");
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class PenugasanDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      PenugasanDosen.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      PenugasanDosen.belongsTo(models.TahunAjaran, { foreignKey: "id_tahun_ajaran" });
      PenugasanDosen.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi" });
      PenugasanDosen.belongsTo(models.Prodi, { foreignKey: "id_prodi" });

      // relasi tabel child
      PenugasanDosen.hasMany(models.PerhitunganSKS, { foreignKey: "id_registrasi_dosen" });
    }
  }
  PenugasanDosen.init(
    {
      id_registrasi_dosen: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      jk: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      nomor_surat_tugas: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      tanggal_surat_tugas: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      mulai_surat_tugas: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_create: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      tanggal_ptk_keluar: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_tahun_ajaran: {
        type: DataTypes.INTEGER(4),
        allowNull: false,
      },
      id_perguruan_tinggi: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "PenugasanDosen",
      tableName: "penugasan_dosens",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tanggal_create = sequelize.literal("CURRENT_DATE");
        },
      },
    }
  );
  return PenugasanDosen;
};
