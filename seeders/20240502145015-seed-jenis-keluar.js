"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenis_keluars", [
      {
        id_jenis_keluar: "7",
        jenis_keluar: "Hilang",
        apa_mahasiswa: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   id_jenis_keluar: "C",
      //   jenis_keluar: "Aktif",
      //   apa_mahasiswa: "0",
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenis_keluars", null, {});
  },
};
