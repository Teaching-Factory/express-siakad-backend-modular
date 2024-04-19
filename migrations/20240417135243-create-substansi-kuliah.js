"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("substansi_kuliahs", {
      id_subtansi_kuliah: {
        allowNull: false,
        type: Sequelize.STRING(32),
        defaultValue: Sequelize.UUIDV4,
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
        type: Sequelize.STRING(32),
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
