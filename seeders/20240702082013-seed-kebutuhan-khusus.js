"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("kebutuhan_khusus", [
      {
        id_kebutuhan_khusus: 0, // ubah dari 65536 - jadi 0 pada database, secara manual
        nama_kebutuhan_khusus: "Tidak ada",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("kebutuhan_khusus", null, {});
  },
};
