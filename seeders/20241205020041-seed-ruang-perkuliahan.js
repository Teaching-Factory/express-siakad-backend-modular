"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("ruang_perkuliahans", [
      {
        id: 1,
        id_ruang: "A101",
        nama_ruang_perkuliahan: "Ruang A 101",
        lokasi: "Gedung A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        id_ruang: "A102",
        nama_ruang_perkuliahan: "Ruang A 102",
        lokasi: "Gedung A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        id_ruang: "A103",
        nama_ruang_perkuliahan: "Ruang A 103",
        lokasi: "Gedung A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("ruang_perkuliahans", null, {});
  },
};
