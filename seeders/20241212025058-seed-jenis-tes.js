"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenis_tes", [
      {
        id: 1,
        nama_tes: "Tes TPA",
        keterangan_singkat: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nama_tes: "Tes Buta Warna",
        keterangan_singkat: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nama_tes: "Tes Kesehatan",
        keterangan_singkat: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenis_tes", null, {});
  },
};
