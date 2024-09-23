"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sumber_info_camabas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_sumber: {
        type: Sequelize.STRING(50),
        allowNull: true
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
      id_sumber_periode_pendaftaran: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "sumber_periode_pendaftarans"
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
    await queryInterface.dropTable("sumber_info_camabas");
  }
};
