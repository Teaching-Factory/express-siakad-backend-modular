"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JenisSMS extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  JenisSMS.init(
    {
      id_jenis_sms: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.DECIMAL(2, 0),
      },
      nama_jenis_sms: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JenisSMS",
      tableName: "jenis_sms",
    }
  );
  return JenisSMS;
};
