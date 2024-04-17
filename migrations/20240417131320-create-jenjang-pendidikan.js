"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenjang_pendidikans", {
      id_jenjang_didik: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DECIMAL(2, 0),
      },
      nama_jenjang_didik: {
        type: Sequelize.STRING(50),
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
    await queryInterface.dropTable("jenjang_pendidikans");
  },
};
