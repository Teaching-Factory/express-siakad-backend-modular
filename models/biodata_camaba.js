"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BiodataCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      BiodataCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
      BiodataCamaba.belongsTo(models.Sekolah, { foreignKey: "id_sekolah" });
      BiodataCamaba.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
      BiodataCamaba.belongsTo(models.JenisTinggal, { foreignKey: "id_jenis_tinggal" });
      BiodataCamaba.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ayah" });
      BiodataCamaba.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ayah" });
      BiodataCamaba.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ayah" });
      BiodataCamaba.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ibu" });
      BiodataCamaba.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ibu" });
      BiodataCamaba.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ibu" });
      BiodataCamaba.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_wali" });
      BiodataCamaba.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_wali" });
      BiodataCamaba.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_wali" });
    }
  }
  BiodataCamaba.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nik: {
        type: DataTypes.CHAR(18),
        allowNull: true
      },
      nisn: {
        type: DataTypes.CHAR(10),
        allowNull: true
      },
      npwp: {
        type: DataTypes.CHAR(15),
        allowNull: true
      },
      kewarganegaraan: {
        type: DataTypes.CHAR(20),
        allowNull: true
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: true
      },
      dusun: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      rt: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true
      },
      rw: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true
      },
      kelurahan: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      kode_pos: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true
      },
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      handphone: {
        type: DataTypes.STRING(20),
        allowNull: true
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true
      },
      nik_ayah: {
        type: DataTypes.CHAR(16),
        allowNull: true
      },
      nama_ayah: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tanggal_lahir_ayah: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      nik_ibu: {
        type: DataTypes.CHAR(16),
        allowNull: true
      },
      nama_ibu_kandung: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tanggal_lahir_ibu: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      nama_wali: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      tanggal_lahir_wali: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_sekolah: {
        type: DataTypes.STRING(36),
        allowNull: true
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: true
      },
      id_jenis_tinggal: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true
      },
      id_pendidikan_ayah: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true
      },
      id_pekerjaan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      id_penghasilan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      id_pendidikan_ibu: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true
      },
      id_pekerjaan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      id_penghasilan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      id_pendidikan_wali: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true
      },
      id_pekerjaan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      },
      id_penghasilan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true
      }
    },
    {
      sequelize,
      modelName: "BiodataCamaba",
      tableName: "biodata_camabas"
    }
  );
  return BiodataCamaba;
};
