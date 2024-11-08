"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kategori_kegiatans", {
      id_kategori_kegiatan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_kategori_kegiatan: {
        type: Sequelize.STRING(300),
        allowNull: false,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
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
    await queryInterface.dropTable("kategori_kegiatans");
  },
};
