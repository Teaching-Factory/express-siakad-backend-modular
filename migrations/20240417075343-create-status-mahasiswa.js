"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("status_mahasiswas", {
      id_status_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(1),
      },
      nama_status_mahasiswa: {
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
    await queryInterface.dropTable("status_mahasiswas");
  },
};
