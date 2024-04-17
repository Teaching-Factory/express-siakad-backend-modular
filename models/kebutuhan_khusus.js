"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class KebutuhanKhusus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  KebutuhanKhusus.init(
    {
      nama_kebutuhan_khusus: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "KebutuhanKhusus",
      tableName: "kebutuhan_khusus",
    }
  );
  return KebutuhanKhusus;
};
