"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("profil_pts", {
      id_profil_pt: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER(10),
      },
      telepon: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      faximile: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      website: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      jalan: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      dusun: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      rt_rw: {
        type: Sequelize.STRING(7),
        allowNull: true,
      },
      kelurahan: {
        type: Sequelize.STRING(60),
        allowNull: false,
      },
      kode_pos: {
        type: Sequelize.DECIMAL(5, 0),
        allowNull: true,
      },
      lintang_bujur: {
        type: Sequelize.STRING(24),
        allowNull: true,
      },
      bank: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      unit_cabang: {
        type: Sequelize.STRING(60),
        allowNull: true,
      },
      nomor_rekening: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      mbs: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      luas_tanah_milik: {
        type: Sequelize.DECIMAL(7, 0),
        allowNull: false,
      },
      luas_tanah_bukan_milik: {
        type: Sequelize.DECIMAL(7, 0),
        allowNull: false,
      },
      sk_pendirian: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      tanggal_sk_pendirian: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_status_milik: {
        type: Sequelize.DECIMAL(1, 0),
        allowNull: false,
      },
      nama_status_milik: {
        type: Sequelize.STRING(50),
        allowNull: true,
      },
      status_perguruan_tinggi: {
        type: Sequelize.CHAR(1),
        allowNull: false,
      },
      sk_izin_operasional: {
        type: Sequelize.STRING(80),
        allowNull: true,
      },
      tanggal_izin_operasional: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      id_perguruan_tinggi: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "perguruan_tinggis",
          },
          key: "id_perguruan_tinggi",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      id_wilayah: {
        type: Sequelize.CHAR(8),
        allowNull: true,
        references: {
          model: {
            tableName: "wilayahs",
          },
          key: "id_wilayah",
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
    await queryInterface.dropTable("profil_pts");
  },
};
