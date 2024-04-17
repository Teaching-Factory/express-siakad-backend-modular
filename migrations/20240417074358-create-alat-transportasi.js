"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("alat_transportasis", {
      id_alat_transportasi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DECIMAL(2, 0),
      },
      nama_alat_transportasi: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable("alat_transportasis");
  },
};
