"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mata_kuliahs", {
      id_matkul: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(32),
        defaultValue: Sequelize.UUIDV4,
      },
      tgl_create: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      jenis_mk: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      kel_mk: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      kode_mata_kuliah: {
        type: Sequelize.STRING(20),
        allowNull: false,
      },
      nama_mata_kuliah: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      sks_mata_kuliah: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      id_jenis_mata_kuliah: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      id_kelompok_mata_kuliah: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      sks_tatap_muka: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_praktek_lapangan: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      sks_simulasi: {
        type: Sequelize.DECIMAL(5, 2),
        allowNull: false,
      },
      metode_kuliah: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      ada_sap: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_silabus: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_bahan_ajar: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_acara_praktek: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      ada_diktat: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      tanggal_mulai_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      tanggal_selesai_efektif: {
        type: Sequelize.DATEONLY,
        allowNull: true,
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
    await queryInterface.dropTable("mata_kuliahs");
  },
};
