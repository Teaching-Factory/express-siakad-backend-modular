"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenis_keluars", {
      id_jenis_keluar: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(1),
      },
      jenis_keluar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      apa_mahasiswa: {
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
    await queryInterface.dropTable("jenis_keluars");
  },
};
