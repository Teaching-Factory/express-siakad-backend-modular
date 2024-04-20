"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("peserta_kelas_kuliahs", {
      id_peserta_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      angkatan: {
        type: Sequelize.CHAR(4),
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
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "mahasiswas",
          },
          key: "id_registrasi_mahasiswa",
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
    await queryInterface.dropTable("peserta_kelas_kuliahs");
  },
};
