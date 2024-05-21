"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("roles", [
      {
        id: 1,
        nama_role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nama_role: "dosen",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nama_role: "mahasiswa",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        nama_role: "admin-prodi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        nama_role: "admin-keuangan",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("roles", null, {});
  },
};
