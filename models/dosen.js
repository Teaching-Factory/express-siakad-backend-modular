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
      Dosen.belongsTo(models.Agama, { foreignKey: "id_agama" });
      Dosen.belongsTo(models.StatusKeaktifanPegawai, { foreignKey: "id_status_aktif" });
      Dosen.hasMany(models.BiodataDosen, { foreignKey: "id_dosen" });
      Dosen.hasMany(models.PenugasanDosen, { foreignKey: "id_dosen" });
    }
  }
  Dosen.init(
    {
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
        allowNull: false,
      },
      jenis_kelamin: {
        type: DataTypes.CHAR(1),
        allowNull: false,
      },
      tanggal_lahir: {
        type: DataTypes.DATE,
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
