"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("dosen_walis", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      id_dosen: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "dosens",
          },
          key: "id_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
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
      id_tahun_ajaran: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
          model: {
            tableName: "tahun_ajarans",
          },
          key: "id_tahun_ajaran",
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
    await queryInterface.dropTable("dosen_walis");
  },
};
