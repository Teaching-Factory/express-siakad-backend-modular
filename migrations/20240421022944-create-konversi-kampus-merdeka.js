"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("konversi_kampus_merdekas", {
      id_konversi_aktivitas: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nilai_angka: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      nilai_indeks: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
      },
      nilai_huruf: {
        type: Sequelize.CHAR(3),
        allowNull: true,
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
      id_anggota: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "anggota_aktivitas_mahasiswas",
          },
          key: "id_anggota",
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
    await queryInterface.dropTable("konversi_kampus_merdekas");
  },
};
