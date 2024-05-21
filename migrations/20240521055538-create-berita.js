"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("beritas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      judul_berita: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      deskripsi_pendek: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      kategori_berita: {
        type: Sequelize.ENUM(["Info", "Pengumuman"]),
        allowNull: false,
      },
      share_public: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false,
      },
      thumbnail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      konten_berita: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("beritas");
  },
};
