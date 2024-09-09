"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisBerkas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel child
      JenisBerkas.hasMany(models.BerkasPeriodePendaftaran, { foreignKey: "id_jenis_berkas" });
    }
  }
  JenisBerkas.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_berkas: {
        type: DataTypes.STRING(50),
        allowNull: false
      },
      keterangan_singkat: {
        type: DataTypes.TEXT,
        allowNull: true
      },
      jumlah: {
        type: DataTypes.INTEGER(4),
        allowNull: false
      },
      wajib: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      upload: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "JenisBerkas",
      tableName: "jenis_berkas"
    }
  );
  return JenisBerkas;
};
