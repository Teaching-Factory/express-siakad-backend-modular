"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perguruan_tinggis", {
      id_perguruan_tinggi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      kode_perguruan_tinggi: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      nama_perguruan_tinggi: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      nama_singkat: {
        type: Sequelize.STRING(20),
        allowNull: true,
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
    await queryInterface.dropTable("perguruan_tinggis");
  },
};
