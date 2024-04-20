"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("jenis_aktivitas_mahasiswas", {
      id_jenis_aktivitas_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(2),
      },
      nama_jenis_aktivitas_mahasiswa: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      untuk_kampus_merdeka: {
        type: Sequelize.DECIMAL(1, 0),
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
    await queryInterface.dropTable("jenis_aktivitas_mahasiswas");
  },
};
