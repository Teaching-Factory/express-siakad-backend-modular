"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("status_keaktifan_pegawais", [
      {
        id_status_aktif: 22,
        nama_status_aktif: "Almarhum",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("status_keaktifan_pegawais", null, {});
  },
};
