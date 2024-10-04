"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class SettingGlobal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      SettingGlobal.belongsTo(models.Prodi, { foreignKey: "id_prodi" });
    }
  }
  SettingGlobal.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      open_krs: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      open_assessment: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      open_khs: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      open_transcript: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      open_questionnaire: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      id_prodi: {
        type: DataTypes.STRING(36),
        allowNull: false
      }
    },
    {
      sequelize,
      modelName: "SettingGlobal",
      tableName: "setting_globals"
    }
  );
  return SettingGlobal;
};
