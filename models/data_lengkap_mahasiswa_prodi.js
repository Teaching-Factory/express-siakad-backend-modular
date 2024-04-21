"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DataLengkapMahasiswaProdi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      DataLengkapMahasiswaProdi.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      DataLengkapMahasiswaProdi.belongsTo(models.Semester, { foreignKey: "id_periode_masuk" });
      DataLengkapMahasiswaProdi.belongsTo(models.Mahasiswa, { foreignKey: "id_registrasi_mahasiswa" });
      DataLengkapMahasiswaProdi.belongsTo(models.Agama, { foreignKey: "id_agama" });
      DataLengkapMahasiswaProdi.belongsTo(models.Wilayah, { foreignKey: "id_wilayah" });
      DataLengkapMahasiswaProdi.belongsTo(models.JenisTinggal, { foreignKey: "id_jenis_tinggal" });
      DataLengkapMahasiswaProdi.belongsTo(models.AlatTransportasi, { foreignKey: "id_alat_transportasi" });
      DataLengkapMahasiswaProdi.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ayah" });
      DataLengkapMahasiswaProdi.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ayah" });
      DataLengkapMahasiswaProdi.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ayah" });
      DataLengkapMahasiswaProdi.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_ibu" });
      DataLengkapMahasiswaProdi.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_ibu" });
      DataLengkapMahasiswaProdi.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_ibu" });
      DataLengkapMahasiswaProdi.belongsTo(models.JenjangPendidikan, { foreignKey: "id_pendidikan_wali" });
      DataLengkapMahasiswaProdi.belongsTo(models.Pekerjaan, { foreignKey: "id_pekerjaan_wali" });
      DataLengkapMahasiswaProdi.belongsTo(models.Penghasilan, { foreignKey: "id_penghasilan_wali" });
      DataLengkapMahasiswaProdi.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_mahasiswa" });
      DataLengkapMahasiswaProdi.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ayah" });
      DataLengkapMahasiswaProdi.belongsTo(models.KebutuhanKhusus, { foreignKey: "id_kebutuhan_khusus_ibu" });
      DataLengkapMahasiswaProdi.belongsTo(models.PerguruanTinggi, { foreignKey: "id_perguruan_tinggi_asal" });
      DataLengkapMahasiswaProdi.belongsTo(models.Prodi, { foreignKey: "id_prodi_asal" });
    }
  }
  DataLengkapMahasiswaProdi.init(
    {
      nama_status_mahasiswa: {
        type: DataTypes.STRING(40),
        allowNull: true,
      },
      jalur_masuk: {
        type: DataTypes.DECIMAL(4, 0),
        allowNull: true,
      },
      nama_jalur_masuk: {
        type: DataTypes.STRING(60),
        allowNull: true,
      },
      sks_diakui: {
        type: DataTypes.DECIMAL(3, 0),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_periode_masuk: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_agama: {
        type: DataTypes.SMALLINT(5),
        allowNull: true,
      },
      id_wilayah: {
        type: DataTypes.CHAR(8),
        allowNull: true,
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
        allowNull: true,
      },
      id_kebutuhan_khusus_ayah: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_kebutuhan_khusus_ibu: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      id_perguruan_tinggi_asal: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
      id_prodi_asal: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DataLengkapMahasiswaProdi",
      tableName: "data_lengkap_mahasiswa_prodis",
    }
  );
  return DataLengkapMahasiswaProdi;
};
