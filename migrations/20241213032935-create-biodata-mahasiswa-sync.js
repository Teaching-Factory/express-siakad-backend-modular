"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("biodata_mahasiswa_syncs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jenis_singkron: {
        type: Sequelize.ENUM(["get", "create", "update", "delete"]),
        allowNull: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_mahasiswa: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "biodata_mahasiswas",
          },
          key: "id_mahasiswa",
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
    await queryInterface.dropTable("biodata_mahasiswa_syncs");
  },
};
