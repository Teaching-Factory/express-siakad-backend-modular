"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sumber_periode_pendaftarans", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_periode_pendaftaran: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
        references: {
          model: {
            tableName: "periode_pendaftarans"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      id_sumber: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "sumbers"
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
    await queryInterface.dropTable("sumber_periode_pendaftarans");
  }
};
