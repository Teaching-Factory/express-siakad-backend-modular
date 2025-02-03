"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profil_penilaians", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nilai_min: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      nilai_max: {
        type: Sequelize.INTEGER(3),
        allowNull: false,
      },
      nilai_indeks: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      nilai_huruf: {
        type: Sequelize.CHAR(1),
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
    await queryInterface.dropTable("profil_penilaians");
  },
};
