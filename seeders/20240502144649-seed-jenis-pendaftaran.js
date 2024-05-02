"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenis_pendaftarans", [
      {
        id_jenis_daftar: 11,
        nama_jenis_daftar: "Alih Jenjang",
        untuk_daftar_sekolah: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_jenis_daftar: 12,
        nama_jenis_daftar: "Lintas Jalur",
        untuk_daftar_sekolah: "0",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenis_pendaftarans", null, {});
  },
};
