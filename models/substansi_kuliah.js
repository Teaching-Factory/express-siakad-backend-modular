"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SubstansiKuliah extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubstansiKuliah.belongsTo(models.Substansi, { foreignKey: "id_substansi" });
    }
  }
  SubstansiKuliah.init(
    {
      tgl_create: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      last_update: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      id_substansi: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "SubstansiKuliah",
      tableName: "substansi_kuliahs",
      hooks: {
        beforeCreate: (instance, options) => {
          instance.tgl_create = new Date();
        },
        beforeUpdate: (instance, options) => {
          instance.last_update = new Date();
        },
      },
    }
  );
  return SubstansiKuliah;
};
