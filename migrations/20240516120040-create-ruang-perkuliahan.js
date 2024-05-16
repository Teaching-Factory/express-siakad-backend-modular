"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("ruang_perkuliahans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      id_ruang: {
        type: Sequelize.STRING(5),
        allowNull: false,
      },
      nama_ruang_perkuliahan: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      lokasi: {
        type: Sequelize.STRING(10),
        allowNull: false,
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
    await queryInterface.dropTable("ruang_perkuliahans");
  },
};
