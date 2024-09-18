"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("periode_yudisiums", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama_periode_yudisium: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters"
          },
          key: "id_semester"
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
    await queryInterface.dropTable("periode_yudisiums");
  }
};
