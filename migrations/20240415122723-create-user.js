"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(20),
      },
      nama: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      username: {
        type: Sequelize.STRING(12),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      hints: {
        type: Sequelize.STRING(8),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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
    await queryInterface.dropTable("users");
  },
};
