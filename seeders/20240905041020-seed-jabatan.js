"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jabatans", [
      {
        id: 1,
        nama_jabatan: "Rektor",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nama_jabatan: "Dekan",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nama_jabatan: "Kepala Program Studi",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nama_jabatan: "Sekertaris Program Studi",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        nama_jabatan: "Direktur",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        nama_jabatan: "Dekan Fakultas Ekonomi",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jabatans", null, {});
  }
};
