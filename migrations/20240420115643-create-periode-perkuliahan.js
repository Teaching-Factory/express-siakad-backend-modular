"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("periode_perkuliahans", {
      id_periode_perkuliahan: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      jumlah_target_mahasiswa_baru: {
        type: Sequelize.DECIMAL(6, 0),
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
      calon_ikut_seleksi: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      calon_lulus_seleksi: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      daftar_sbg_mhs: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      pst_undur_diri: {
        type: Sequelize.DECIMAL(6, 0),
        allowNull: false,
      },
      jml_mgu_kul: {
        type: Sequelize.INTEGER(10),
        allowNull: false,
      },
      metode_kul: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      metode_kul_eks: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      tgl_create: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      last_update: {
        type: Sequelize.DATEONLY,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_DATE"),
      },
      id_prodi: {
        type: Sequelize.STRING(32),
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
    await queryInterface.dropTable("periode_perkuliahans");
  },
};
