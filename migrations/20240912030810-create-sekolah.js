"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("sekolahs", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(36),
        defaultValue: Sequelize.UUIDV4,
      },
      npsn: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      sekolah: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bentuk: {
        type: Sequelize.ENUM(["SMK", "SMA"]),
        allowNull: true,
      },
      status: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      alamat_jalan: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      lintang: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      bujur: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_kec: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      kecamatan: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_kab_kota: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      kabupaten_kota: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      kode_prop: {
        type: Sequelize.CHAR,
        allowNull: true,
      },
      propinsi: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_sync: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      id_feeder: {
        type: Sequelize.STRING(36),
        allowNull: true,
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
    await queryInterface.dropTable("sekolahs");
  },
};
