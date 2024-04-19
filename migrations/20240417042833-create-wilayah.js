"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("wilayahs", {
      id_wilayah: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(8),
      },
      nama_wilayah: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      id_negara: {
        type: Sequelize.CHAR(2),
        allowNull: false,
        references: {
          model: {
            tableName: "negaras",
          },
          key: "id_negara",
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
    await queryInterface.dropTable("wilayahs");
  },
};
