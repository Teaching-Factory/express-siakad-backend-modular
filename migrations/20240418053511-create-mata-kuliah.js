"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mata_kuliahs", {
      id_mata_kuliah: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      id_jenis_mata_kuliah: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      id_kelompok_mata_kuliah: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      id_matkul: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "list_mata_kuliahs",
          },
          key: "id_matkul",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_prodi: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("mata_kuliahs");
  },
};
