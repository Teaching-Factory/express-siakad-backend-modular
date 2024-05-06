"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("rekap_khs_mahasiswas", {
      id_rekap_khs_mahasiswa: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      angkatan: {
        type: Sequelize.CHAR(4),
        allowNull: false,
      },
      nama_periode: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      nilai_angka: {
        type: Sequelize.DECIMAL(4, 1),
        allowNull: true,
      },
      nilai_huruf: {
        type: Sequelize.CHAR(3),
        allowNull: true,
      },
      nilai_indeks: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: true,
      },
      sks_x_indeks: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(36),
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
      id_prodi: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "prodis",
          },
          key: "id_prodi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_periode: {
        type: Sequelize.INTEGER(10),
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
      id_matkul: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mata_kuliahs",
          },
          key: "id_matkul",
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
    await queryInterface.dropTable("rekap_khs_mahasiswas");
  },
};
