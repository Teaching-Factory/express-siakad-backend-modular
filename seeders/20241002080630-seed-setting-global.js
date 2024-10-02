"use strict";
const { Prodi } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Mengambil semua data prodi dari tabel Prodi
    const all_prodi = await Prodi.findAll();

    // Looping untuk membuat data setting_globals berdasarkan all_prodi
    const settingGlobalsData = all_prodi.map((prodi, index) => {
      return {
        id: index + 1, // Membuat ID secara berurutan
        id_prodi: prodi.id_prodi, // Menggunakan id_prodi dari tabel Prodi
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    // Melakukan bulk insert ke tabel setting_globals
    return queryInterface.bulkInsert("setting_globals", settingGlobalsData);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("setting_globals", null, {});
  }
};
