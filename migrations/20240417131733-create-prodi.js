"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("prodis", {
      id_prodi: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      kode_program_studi: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      nama_program_studi: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      id_jenjang_pendidikan: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
        references: {
          model: {
            tableName: "jenjang_pendidikans",
          },
          key: "id_jenjang_didik",
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
    await queryInterface.dropTable("prodis");
  },
};
