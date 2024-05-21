"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Berita extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Berita.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      judul_berita: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      deskripsi_pendek: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      kategori_berita: {
        type: DataTypes.ENUM(["Info", "Pengumuman"]),
        allowNull: false,
      },
      share_public: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      thumbnail: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      konten_berita: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Berita",
      tableName: "beritas",
    }
  );
  return Berita;
};
