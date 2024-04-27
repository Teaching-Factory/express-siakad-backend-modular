"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_kelas_kuliahs", {
      id_detail_kelas_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      bahasan: {
        type: Sequelize.STRING(200),
        allowNull: true,
      },
      tanggal_mulai_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      tanggal_akhir_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      kapasitas: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true,
      },
      tanggal_tutup_daftar: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      prodi_penyelenggara: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      perguruan_tinggi_penyelenggara: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "kelas_kuliahs",
          },
          key: "id_kelas_kuliah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
    await queryInterface.dropTable("detail_kelas_kuliahs");
  },
};
