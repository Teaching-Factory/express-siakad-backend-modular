"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("penghasilans", [
      {
        id_penghasilan: 0, // ganti jadi 0 di database secara manual (penting)
        nama_penghasilan: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("penghasilans", null, {});
  },
};
