"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jalur_masuks", {
      id_jalur_masuk: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DECIMAL(4, 0),
      },
      nama_jalur_masuk: {
        type: Sequelize.STRING(60),
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
    await queryInterface.dropTable("jalur_masuks");
  },
};
