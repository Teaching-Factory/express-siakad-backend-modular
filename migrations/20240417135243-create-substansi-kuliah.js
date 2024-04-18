"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("substansi_kuliahs", {
      id_subtansi_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      tgl_create: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      last_update: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_substansi: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "substansis",
          },
          key: "id_substansi",
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
    await queryInterface.dropTable("substansi_kuliahs");
  },
};
