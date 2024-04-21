"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BidangMinat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      BidangMinat.belongsTo(models.Prodi, { foreignKey: "id_prodi" });

      // relasi tabel child
      BidangMinat.hasMany(models.RiwayatPendidikanMahasiswa, { foreignKey: "id_bidang_minat" });
    }
  }
  BidangMinat.init(
    {
      nm_bidang_minat: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      smt_dimulai: {
        type: DataTypes.CHAR(5),
        allowNull: true,
      },
      sk_bidang_minat: {
        type: DataTypes.STRING(80),
        allowNull: true,
      },
      tamat_sk_bidang_minat: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_prodi: {
        type: DataTypes.STRING(32),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "BidangMinat",
      tableName: "bidang_minats",
    }
  );
  return BidangMinat;
};
