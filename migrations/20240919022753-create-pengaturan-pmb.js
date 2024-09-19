"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pengaturan_pmbs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      upload_bukti_transfer: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      nama_bank: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      nomor_rekening: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      nama_pemilik_rekening: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("pengaturan_pmbs");
  }
};
