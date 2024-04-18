"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BiodataDosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BiodataDosen.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      BiodataDosen.belongsTo(models.Agama, { foreignKey: "id_agama" });
      BiodataDosen.belongsTo(models.StatusKeaktifanPegawai, { foreignKey: "id_status_aktif" });
      BiodataDosen.belongsTo(models.LembagaPengangkatan, { foreignKey: "id_lembaga_pengangkatan" });
      BiodataDosen.belongsTo(models.PangkatGolongan, { foreignKey: "id_pangkat_golongan" });
      BiodataDosen.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
      BiodataDosen.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_suami_istri" });
    }
  }
  BiodataDosen.init(
    {
      tempat_lahir: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      nama_ibu_kandung: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      nik: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      npwp: {
        type: DataTypes.CHAR(18),
        allowNull: true,
      },
      id_jenis_sdm: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      nama_jenis_sdm: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      no_sk_cpns: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      tanggal_sk_cpns: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      no_sk_pengangkatan: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      mulai_sk_pengangkatan: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_sumber_gaji: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      nama_sumber_gaji: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      dusun: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      rt: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      rw: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      ds_kel: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      kode_pos: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      handphone: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      status_pernikahan: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      nama_suami_istri: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      nip_suami_istri: {
        type: DataTypes.STRING(18),
        allowNull: true,
      },
      tanggal_mulai_cpns: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_dosen: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      id_lembaga_pengangkatan: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
      id_pangkat_golongan: {
        type: DataTypes.INTEGER(2),
        allowNull: true,
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: false,
      },
      id_pekerjaan_suami_istri: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BiodataDosen",
      tableName: "biodata_dosens",
    }
  );
  return BiodataDosen;
};
