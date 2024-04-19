"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perhitungan_sks", {
      id_perhitungan_sks: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      rencana_minggu_pertemuan: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
      },
      perhitungan_sks: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(32),
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
      id_registrasi_dosen: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "penugasan_dosens",
          },
          key: "id_registrasi_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_substansi: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "substansis",
          },
          key: "id_substansi",
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
    await queryInterface.dropTable("perhitungan_sks");
  },
};
