"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riwayat_nilai_mahasiswas", {
      id_riwayat_nilai_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      nilai_angka: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true,
      },
      nilai_huruf: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
      nilai_indeks: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },
      angkatan: {
        type: Sequelize.CHAR(4),
        allowNull: false,
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
      id_periode: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "periodes",
          },
          key: "id_periode",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kelas: {
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
    await queryInterface.dropTable("riwayat_nilai_mahasiswas");
  },
};
