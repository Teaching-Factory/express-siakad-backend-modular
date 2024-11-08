"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("semesters", {
      id_semester: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.CHAR(5),
      },
      nama_semester: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      semester: {
        type: Sequelize.INTEGER(1),
        allowNull: false,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
          model: {
            tableName: "tahun_ajarans",
          },
          key: "id_tahun_ajaran",
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
    await queryInterface.dropTable("semesters");
  },
};
