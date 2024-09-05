"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenis_berkas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_berkas: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      keterangan_singkat: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      jumlah: {
        type: Sequelize.INTEGER(4),
        allowNull: false
      },
      wajib: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
      },
      upload: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
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
    await queryInterface.dropTable("jenis_berkas");
  }
};
