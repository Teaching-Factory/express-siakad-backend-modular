"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("aspek_penilaian_dosens", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomor_urut_aspek: {
        type: Sequelize.SMALLINT,
        allowNull: false
      },
      aspek_penilaian: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      tipe_aspek_penilaian: {
        type: Sequelize.ENUM(["Pilihan Ganda", "Essay"]),
        allowNull: true,
        defaultValue: "Pilihan Ganda"
      },
      deskripsi_pendek: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      tanggal_pembuatan: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters"
          },
          key: "id_semester"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("aspek_penilaian_dosens");
  }
};
