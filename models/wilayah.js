"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Wilayah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Wilayah.belongsTo(models.Negara, { foreignKey: "id_negara" });

      // relasi tabel child
      Wilayah.hasMany(models.ProfilPT, { foreignKey: "id_wilayah" });
      Wilayah.hasMany(models.BiodataDosen, { foreignKey: "id_wilayah" });
      Wilayah.hasMany(models.BiodataMahasiswa, { foreignKey: "id_wilayah" });
      Wilayah.hasMany(models.DataLengkapMahasiswaProdi, { foreignKey: "id_wilayah" });
      Wilayah.hasMany(models.BiodataCamaba, { foreignKey: "id_wilayah" });
    }
  }
  Wilayah.init(
    {
      id_wilayah: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.CHAR(8)
      },
      nama_wilayah: {
        type: DataTypes.STRING(60),
        allowNull: false
      },
      id_negara: {
        type: DataTypes.CHAR(2),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "Wilayah",
      tableName: "wilayahs"
    }
  );
  return Wilayah;
};
