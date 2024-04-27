"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BiodataMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      BiodataMahasiswa.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      BiodataMahasiswa.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
      BiodataMahasiswa.belongsTo(models.JenisTinggal, { foreignKey: "id_jenis_tinggal" });
      BiodataMahasiswa.belongsTo(models.AlatTransportasi, { foreignKey: "id_alat_transportasi" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ayah" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ayah" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ayah" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ibu" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ibu" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ibu" });
      BiodataMahasiswa.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_wali" });
      BiodataMahasiswa.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_wali" });
      BiodataMahasiswa.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_wali" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_mahasiswa" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ayah" });
      BiodataMahasiswa.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ibu" });
    }
  }
  BiodataMahasiswa.init(
    {
      id_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      tempat_lahir: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      nik: {
        type: DataTypes.CHAR(16),
        allowNull: false,
      },
      nisn: {
        type: DataTypes.CHAR(10),
        allowNull: true,
      },
      npwp: {
        type: DataTypes.CHAR(15),
        allowNull: true,
      },
      kewarganegaraan: {
        type: DataTypes.CHAR(2),
        allowNull: false,
      },
      jalan: {
        type: DataTypes.STRING(80),
        allowNull: true,
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
      kelurahan: {
        type: DataTypes.STRING(60),
        allowNull: false,
      },
      kode_pos: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      telepon: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      handphone: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      penerima_kps: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: false,
      },
      nomor_kps: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      nik_ayah: {
        type: DataTypes.CHAR(16),
        allowNull: true,
      },
      nama_ayah: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tanggal_lahir_ayah: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nik_ibu: {
        type: DataTypes.CHAR(16),
        allowNull: true,
      },
      nama_ibu_kandung: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      tanggal_lahir_ibu: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      nama_wali: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      tanggal_lahir_wali: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: false,
      },
      id_jenis_tinggal: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_alat_transportasi: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_pendidikan_ayah: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_pekerjaan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_penghasilan_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_pendidikan_ibu: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_pekerjaan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_penghasilan_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_pendidikan_wali: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
      id_pekerjaan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_penghasilan_wali: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_kebutuhan_khusus_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_kebutuhan_khusus_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_kebutuhan_khusus_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "BiodataMahasiswa",
      tableName: "biodata_mahasiswas",
    }
  );
  return BiodataMahasiswa;
};
