"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("laporan_pmbs", [
      {
        id: 1,
        jenis_laporan: "Laporan Rekap Pendaftaran PMB",
        nama_penandatanganan: "Dr. Haya SHI, MPdI",
        nomor_identitas: "2109067402",
        id_jabatan: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        jenis_laporan: "Laporan Rekap Pembayaran PMB",
        nama_penandatanganan: "Dr.Haya SHI, MPdI",
        nomor_identitas: "2109067402",
        id_jabatan: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("laporan_pmbs", null, {});
  }
};
