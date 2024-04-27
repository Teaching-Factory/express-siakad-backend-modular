"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("detail_periode_perkuliahans", {
      id_detail_periode_perkuliahan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      jumlah_target_mahasiswa_baru: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      jumlah_pendaftar_ikut_seleksi: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      jumlah_pendaftar_lulus_seleksi: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      jumlah_daftar_ulang: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      jumlah_mengundurkan_diri: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: false,
      },
      tanggal_awal_perkuliahan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggal_akhir_perkuliahan: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      jumlah_minggu_pertemuan: {
        type: Sequelize.DECIMAL(2, 0),
        allowNull: false,
      },
      id_prodi: {
        type: Sequelize.STRING(36),
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
      id_semester: {
        type: Sequelize.CHAR(5),
        allowNull: false,
        references: {
          model: {
            tableName: "semesters",
          },
          key: "id_semester",
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
    await queryInterface.dropTable("detail_periode_perkuliahans");
  },
};
