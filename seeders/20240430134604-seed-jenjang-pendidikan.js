"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenjang_pendidikans", [
      {
        id_jenjang_didik: 98,
        nama_jenjang_didik: "(tidak diisi)",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenjang_pendidikans", null, {});
  },
};
