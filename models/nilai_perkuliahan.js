"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class NilaiPerkuliahan extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // relasi tabel parent
      NilaiPerkuliahan.belongsTo(models.DetailNilaiPerkuliahanKelas, { foreignKey: "id_detail_nilai_perkuliahan_kelas" });
      NilaiPerkuliahan.belongsTo(models.UnsurPenilaian, { foreignKey: "id_unsur_penilaian" });
    }
  }
  NilaiPerkuliahan.init(
    {
      id_nilai: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER(10),
      },
      nilai: {
        type: DataTypes.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 0,
      },
      id_unsur_penilaian: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
      id_detail_nilai_perkuliahan_kelas: {
        type: DataTypes.INTEGER(10),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "NilaiPerkuliahan",
      tableName: "nilai_perkuliahans",
    }
  );
  return NilaiPerkuliahan;
};
