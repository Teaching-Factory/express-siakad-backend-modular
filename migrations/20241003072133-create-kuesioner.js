"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("kuesioners", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mahasiswas"
          },
          key: "id_registrasi_mahasiswa"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "kelas_kuliahs"
          },
          key: "id_kelas_kuliah"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_aspek_penilaian_dosen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "aspek_penilaian_dosens"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_skala_penilaian_dosen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "skala_penilaian_dosens"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
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
    await queryInterface.dropTable("kuesioners");
  }
};
