"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("pemberkasan_camabas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      file_berkas: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      id_berkas_periode_pendaftaran: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "berkas_periode_pendaftarans"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_camaba: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "camabas"
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
    await queryInterface.dropTable("pemberkasan_camabas");
  }
};
