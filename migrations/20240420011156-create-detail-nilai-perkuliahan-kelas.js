"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_nilai_perkuliahan_kelas", {
      id_detail_nilai_perkuliahan_kelas: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      jurusan: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      angkatan: {
        type: Sequelize.STRING(4),
        allowNull: false,
      },
      nilai_angka: {
        type: Sequelize.DECIMAL(4, 0),
        allowNull: true,
      },
      nilai_indeks: {
        type: Sequelize.DECIMAL(4, 0),
        allowNull: false,
      },
      nilai_huruf: {
        type: Sequelize.CHAR(3),
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
    await queryInterface.dropTable("detail_nilai_perkuliahan_kelas");
  },
};
