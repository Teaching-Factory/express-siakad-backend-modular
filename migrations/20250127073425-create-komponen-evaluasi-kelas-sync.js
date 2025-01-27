"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("komponen_evaluasi_kelas_syncs", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      jenis_singkron: {
        type: Sequelize.ENUM(["create", "update", "delete"]),
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
      id_komponen_evaluasi: {
        type: Sequelize.STRING(36),
        allowNull: true,
        references: {
          model: {
            tableName: "komponen_evaluasi_kelas",
          },
          key: "id_komponen_evaluasi",
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
    await queryInterface.dropTable("komponen_evaluasi_kelas_syncs");
  },
};
