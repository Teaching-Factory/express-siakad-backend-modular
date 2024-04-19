"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("periodes", {
      id_periode: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(5),
      },
      periode_pelaporan: {
        type: Sequelize.CHAR(5),
        allowNull: false,
      },
      tipe_periode: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      id_prodi: {
        type: Sequelize.STRING(32),
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
    await queryInterface.dropTable("periodes");
  },
};
