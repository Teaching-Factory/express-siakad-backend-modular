"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KelasKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      KelasKuliah.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
      KelasKuliah.belongsTo(models.Semester, { foreignKey: "id_semester" });
      KelasKuliah.belongsTo(models.MataKuliah, { foreignKey: "id_matkul" });
      KelasKuliah.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
      KelasKuliah.hasMany(models.DetailKelasKuliah, { foreignKey: "id_kelas_kuliah" });
      KelasKuliah.hasMany(models.PerhitunganSKS, { foreignKey: "id_kelas_kuliah" });
    }
  }
  KelasKuliah.init(
    {
      nama_kelas_kuliah: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      sks: {
        type: DataTypes.DECIMAL(5, 0),
        allowNull: true,
      },
      jumlah_mahasiswa: {
        type: DataTypes.INTEGER(10),
        allowNull: true,
      },
      apa_untuk_pditt: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      lingkup: {
        type: DataTypes.DECIMAL(1, 0),
        allowNull: true,
      },
      mode: {
        type: DataTypes.CHAR(1),
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false,
      },
      id_matkul: {
        type: DataTypes.STRING(32),
        allowNull: false,
      },
      id_dosen: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "KelasKuliah",
      tableName: "kelas_kuliahs",
    }
  );
  return KelasKuliah;
};
