"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("mahasiswa_bimbingan_dosens", {
      id_bimbing_mahasiswa: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      pembimbing_ke: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      id_aktivitas: {
        type: Sequelize.STRING(36),
        allowNull: false,
        references: {
          model: {
            tableName: "aktivitas_mahasiswas",
          },
          key: "id_aktivitas",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_kategori_kegiatan: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: "kategori_kegiatans",
          },
          key: "id_kategori_kegiatan",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_dosen: {
        type: Sequelize.STRING(36),
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
    await queryInterface.dropTable("mahasiswa_bimbingan_dosens");
  },
};
