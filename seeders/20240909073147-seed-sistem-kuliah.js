"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("sistem_kuliahs", [
      {
        id: 1,
        nama_sk: "Kelas Karyawan",
        kode_sk: "02",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nama_sk: "Reguler",
        kode_sk: "01",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("sistem_kuliahs", null, {});
  }
};
