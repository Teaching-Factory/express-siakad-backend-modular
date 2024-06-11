"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("presensi_mahasiswas", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      presensi_hadir: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      tanggal_presensi: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      waktu_presensi: {
        type: Sequelize.TIME,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIME"),
      },
      status_presensi: {
        type: Sequelize.ENUM(["Hadir", "Izin", "Alfa", "Sakit"]),
        allowNull: false,
      },
      id_pertemuan_perkuliahan: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "pertemuan_perkuliahans",
          },
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_registrasi_mahasiswa: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "mahasiswas",
          },
          key: "id_registrasi_mahasiswa",
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
    await queryInterface.dropTable("presensi_mahasiswas");
  },
};
