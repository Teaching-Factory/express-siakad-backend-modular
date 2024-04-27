"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("bidang_minats", {
      id_bidang_minat: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      nm_bidang_minat: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      smt_dimulai: {
        type: Sequelize.CHAR(5),
        allowNull: true,
      },
      sk_bidang_minat: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      tamat_sk_bidang_minat: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_prodi: {
        type: Sequelize.STRING(36),
        allowNull: true,
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
    await queryInterface.dropTable("bidang_minats");
  },
};
