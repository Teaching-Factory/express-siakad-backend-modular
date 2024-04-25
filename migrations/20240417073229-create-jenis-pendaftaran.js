"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenis_pendaftarans", {
      id_jenis_daftar: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.DECIMAL(2, 0),
      },
      nama_jenis_daftar: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      untuk_daftar_sekolah: {
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
    await queryInterface.dropTable("jenis_pendaftarans");
  },
};
