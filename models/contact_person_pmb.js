"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContactPersonPMB extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContactPersonPMB.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      nama_cp_pmb: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      no_wa_cp_pmb: {
        type: DataTypes.STRING(15),
        allowNull: true
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "ContactPersonPMB",
      tableName: "contact_person_pmbs"
    }
  );
  return ContactPersonPMB;
};
