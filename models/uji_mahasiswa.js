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
        validate: {
          isInt: {
            args: true,
            msg: "penguji_ke must be an integer",
          },
        },
      },
      last_sync: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: DataTypes.STRING(36),
        allowNull: true,
      },
      id_aktivitas: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_aktivitas must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_aktivitas must be a string");
          }
        },
      },
      id_kategori_kegiatan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            args: true,
            msg: "id_kategori_kegiatan must be an integer",
          },
        },
      },
      id_dosen: {
        type: DataTypes.STRING(36),
        allowNull: false,
        validate: {
          len: { args: [1, 36], msg: "id_dosen must be between 1 and 36 characters" },
        },
        isString(value) {
          if (typeof value !== "string") {
            throw new Error("id_dosen must be a string");
          }
        },
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
