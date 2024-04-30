"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("lembaga_pengangkatans", [
      {
        id_lembaga_angkat: 1, // ganti jadi 0 di database secara manual (penting)
        nama_lembaga_angkat: "(tidak diisi)",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_lembaga_angkat: 2, // ganti jadi 1 di database secara manual
        nama_lembaga_angkat: "Kementerian Riset, Teknologi dan Pendidikan Tinggi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("lembaga_pengangkatans", null, {});
  },
};
