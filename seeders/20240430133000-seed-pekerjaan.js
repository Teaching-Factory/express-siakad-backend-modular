"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("pekerjaans", [
      {
        id_pekerjaan: 0, // ganti jadi 0 di database secara manual (penting)
        nama_pekerjaan: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("pekerjaans", null, {});
  },
};
