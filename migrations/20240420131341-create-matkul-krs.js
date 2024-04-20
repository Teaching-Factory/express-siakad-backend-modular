"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("matkul_krs", {
      id_matkul_krs: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      id_krs: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "krs_mahasiswas",
          },
          key: "id_krs",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_matkul: {
        type: Sequelize.STRING(32),
        allowNull: false,
        references: {
          model: {
            tableName: "mata_kuliahs",
          },
          key: "id_matkul",
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
    await queryInterface.dropTable("matkul_krs");
  },
};
