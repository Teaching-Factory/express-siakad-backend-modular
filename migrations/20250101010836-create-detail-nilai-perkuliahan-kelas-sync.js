"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_nilai_perkuliahan_kelas_syncs", {
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
      id_kelas_kuliah_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_registrasi_mahasiswa_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
      },
      id_detail_nilai_perkuliahan_kelas: {
        type: Sequelize.INTEGER(10),
        allowNull: true,
        references: {
          model: {
            tableName: "detail_nilai_perkuliahan_kelas",
          },
          key: "id_detail_nilai_perkuliahan_kelas",
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
    await queryInterface.dropTable("detail_nilai_perkuliahan_kelas_syncs");
  },
};
