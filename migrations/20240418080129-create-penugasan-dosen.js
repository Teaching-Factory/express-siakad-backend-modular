"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("penugasan_dosens", {
      id_registrasi_dosen: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      jk: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      nama_surat_tugas: {
        type: Sequelize.STRING(80),
        allowNull: false,
      },
      tanggal_surat_tugas: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      mulai_surat_tugas: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggal_create: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      tanggal_ptk_keluar: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_dosen: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "dosens",
          },
          key: "id_dosen",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_tahun_ajaran: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        references: {
          model: {
            tableName: "tahun_ajarans",
          },
          key: "id_tahun_ajaran",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_perguruan_tinggi: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: {
            tableName: "perguruan_tinggis",
          },
          key: "id_perguruan_tinggi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_prodi: {
        type: Sequelize.UUID,
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
    await queryInterface.dropTable("penugasan_dosens");
  },
};
