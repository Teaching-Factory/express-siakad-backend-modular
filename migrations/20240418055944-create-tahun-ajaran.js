"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tahun_ajarans", {
      id_tahun_ajaran: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(4),
      },
      nama_tahun_ajaran: {
        type: Sequelize.STRING(50),
      },
      a_periode: {
        type: Sequelize.INTEGER(1),
      },
      tanggal_mulai: {
        type: Sequelize.DATE,
      },
      tanggal_selesai: {
        type: Sequelize.DATE,
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
    await queryInterface.dropTable("tahun_ajarans");
  },
};
