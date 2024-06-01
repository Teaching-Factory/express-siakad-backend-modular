"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class UjiMahasiswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      UjiMahasiswa.belongsTo(models.AktivitasMahasiswa, { foreignKey: "id_aktivitas" });
      UjiMahasiswa.belongsTo(models.KategoriKegiatan, { foreignKey: "id_kategori_kegiatan" });
      UjiMahasiswa.belongsTo(models.Dosen, { foreignKey: "id_dosen" });
    }
  }
  UjiMahasiswa.init(
    {
      id_uji: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      penguji_ke: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_aktivitas: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
      id_kategori_kegiatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "UjiMahasiswa",
      tableName: "uji_mahasiswas",
    }
  );
  return UjiMahasiswa;
};
