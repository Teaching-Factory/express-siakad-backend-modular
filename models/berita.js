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
        validate: {
          len: { args: [1, 100], msg: "judul_berita must be between 1 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("judul_berita must be a string");
          }
        },
      },
      deskripsi_pendek: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          len: { args: [1, 100], msg: "deskripsi_pendek must be between 1 and 100 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("deskripsi_pendek must be a string");
          }
        },
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
        validate: {
          len: { args: [1, 255], msg: "thumbnail must be between 1 and 255 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("thumbnail must be a string");
          }
        },
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
