"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TagihanCamaba extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      TagihanCamaba.belongsTo(models.Semester, { foreignKey: "id_semester" });
      TagihanCamaba.belongsTo(models.Camaba, { foreignKey: "id_camaba" });
      TagihanCamaba.belongsTo(models.PeriodePendaftaran, { foreignKey: "id_periode_pendaftaran" });
    }
  }
  TagihanCamaba.init(
    {
      id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4
      },
      jenis_tagihan: {
        type: DataTypes.ENUM("PMB"),
        allowNull: true,
        defaultValue: "PMB"
      },
      jumlah_tagihan: {
        type: DataTypes.DECIMAL(12, 0),
        allowNull: true,
        defaultValue: 0
      },
      tanggal_tagihan: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      tanggal_lunas: {
        type: DataTypes.DATEONLY,
        allowNull: true
      },
      status_tagihan: {
        type: DataTypes.ENUM("Lunas", "Belum Bayar"),
        allowNull: true,
        defaultValue: "Belum Bayar"
      },
      upload_bukti: {
        type: DataTypes.STRING(255),
        allowNull: true
      },
      validasi_tagihan: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      id_semester: {
        type: DataTypes.CHAR(5),
        allowNull: false
      },
      id_camaba: {
        type: DataTypes.STRING(36),
        allowNull: false
      },
      id_periode_pendaftaran: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "TagihanCamaba",
      tableName: "tagihan_camabas"
    }
  );
  return TagihanCamaba;
};
