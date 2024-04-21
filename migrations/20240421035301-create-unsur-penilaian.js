"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("unsur_penilaians", {
      id_unsur_penilaian: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      id_unsur: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      nama_unsur_penilaian: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      nama_lembaga: {
        type: Sequelize.STRING(255),
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
    await queryInterface.dropTable("unsur_penilaians");
  },
};
