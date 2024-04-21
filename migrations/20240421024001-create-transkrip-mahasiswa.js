"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("transkrip_mahasiswas", {
      id_transkrip_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      smt_diambil: {
        type: Sequelize.INTEGER(2),
        allowNull: true,
      },
      id_nilai_transfer: {
        type: Sequelize.STRING(32),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "mahasiswas",
          },
          key: "id_registrasi_mahasiswa",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_matkul: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "mata_kuliahs",
          },
          key: "id_matkul",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kelas_kuliah: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "kelas_kuliahs",
          },
          key: "id_kelas_kuliah",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_konversi_aktivitas: {
        type: Sequelize.STRING(32),
        allowNull: true,
        references: {
          model: {
            tableName: "konversi_kampus_merdekas",
          },
          key: "id_konversi_aktivitas",
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
    await queryInterface.dropTable("transkrip_mahasiswas");
  },
};
