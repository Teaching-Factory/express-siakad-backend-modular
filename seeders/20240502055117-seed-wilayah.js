"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("wilayahs", [
      {
        id_wilayah: 999999,
        nama_wilayah: "tidak ada",
        id_negara: "ID",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("wilayahs", null, {});
  },
};
