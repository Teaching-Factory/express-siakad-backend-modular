"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fakultas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      Fakultas.belongsTo(models.JenjangPendidikan, { foreignKey: "id_jenjang_pendidikan" });
    }
  }
  Fakultas.init(
    {
      id_fakultas: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING(36),
        defaultValue: DataTypes.UUIDV4,
      },
      nama_fakultas: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(1),
        allowNull: true,
      },
      id_jenjang_pendidikan: {
        type: DataTypes.DECIMAL(2, 0),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Fakultas",
      tableName: "fakultas",
    }
  );
  return Fakultas;
};
