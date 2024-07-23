"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("nilai_perkuliahans", {
      id_nilai: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      nilai: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
        defaultValue: 0,
      },
      id_unsur_penilaian: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "unsur_penilaians",
          },
          key: "id_unsur_penilaian",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_detail_nilai_perkuliahan_kelas: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "detail_nilai_perkuliahan_kelas",
          },
          key: "id_detail_nilai_perkuliahan_kelas",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("nilai_perkuliahans");
  },
};
