"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("riwayat_pendidikan_mahasiswa_syncs", {
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
        type: Sequelize.STRING,
        allowNull: true,
      },
      id_riwayat_pend_mhs: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: {
            tableName: "riwayat_pendidikan_mahasiswas",
          },
          key: "id_riwayat_pend_mhs",
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
    await queryInterface.dropTable("riwayat_pendidikan_mahasiswa_syncs");
  },
};
