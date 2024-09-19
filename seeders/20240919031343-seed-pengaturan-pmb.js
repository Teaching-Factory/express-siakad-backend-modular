"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("pengaturan_pmbs", [
      {
        id: 1,
        upload_bukti_transfer: false,
        nama_bank: "-",
        nomor_rekening: "-",
        nama_pemilik_rekening: "-",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("pengaturan_pmbs", null, {});
  }
};
