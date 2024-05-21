"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Dosen extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Dosen.belongsTo(models.Agama, { foreignKey: "id_agama" });
      Dosen.belongsTo(models.StatusKeaktifanPegawai, { foreignKey: "id_status_aktif" });

      // relasi tabel child
      Dosen.hasMany(models.BiodataDosen, { foreignKey: "id_dosen" });
      Dosen.hasMany(models.PenugasanDosen, { foreignKey: "id_dosen" });
      Dosen.hasMany(models.KelasKuliah, { foreignKey: "id_dosen" });
      Dosen.hasMany(models.UnitJabatan, { foreignKey: "id_dosen" });
      Dosen.hasMany(models.DosenWali, { foreignKey: "id_dosen" });
    }
  }
  Dosen.init(
    {
      id_dosen: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama_dosen: {
        type: DataTypes.STRING(200),
        allowNull: false,
      },
      nidn: {
        type: DataTypes.CHAR(10),
        allowNull: false,
      },
      nip: {
        type: DataTypes.STRING(18),
        allowNull: true,
      },
      jenis_kelamin: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      id_agama: {
        type: DataTypes.SMALLINT(5),
        allowNull: false,
      },
      id_status_aktif: {
        type: DataTypes.INTEGER(2),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Dosen",
      tableName: "dosens",
    }
  );
  return Dosen;
};
