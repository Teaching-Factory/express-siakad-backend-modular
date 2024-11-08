"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("skala_nilai_prodis", {
      id_bobot_nilai: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      tgl_create: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      nilai_huruf: {
        type: Sequelize.CHAR(3),
        allowNull: false,
      },
      nilai_indeks: {
        type: Sequelize.DECIMAL(4, 2),
        allowNull: false,
      },
      bobot_minimum: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      bobot_maksimum: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      tanggal_mulai_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
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
    await queryInterface.dropTable("skala_nilai_prodis");
  },
};
