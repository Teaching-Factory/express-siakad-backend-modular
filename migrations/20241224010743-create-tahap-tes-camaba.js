"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("tahap_tes_camabas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      status: {
        type: Sequelize.ENUM("Lulus", "Tidak Lulus", "Menunggu Persetujuan"),
        allowNull: false,
      },
      id_camaba: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "camabas",
          },
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      id_tahap_tes_periode_pendaftaran: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "tahap_tes_periode_pendaftarans",
          },
          key: "id",
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
    await queryInterface.dropTable("tahap_tes_camabas");
  },
};
