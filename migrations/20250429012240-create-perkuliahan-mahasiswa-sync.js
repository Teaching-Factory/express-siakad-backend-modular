"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("perkuliahan_mahasiswa_syncs", {
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
      id_registrasi_mahasiswa_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_semester_feeder: {
        type: Sequelize.CHAR(5),
        allowNull: true,
      },
      id_perkuliahan_mahasiswa: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "perkuliahan_mahasiswas",
          },
          key: "id_perkuliahan_mahasiswa",
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
    await queryInterface.dropTable("perkuliahan_mahasiswa_syncs");
  },
};
