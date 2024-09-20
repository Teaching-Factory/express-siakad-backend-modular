"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("jenis_tagihans", [
      {
        id_jenis_tagihan: 1,
        nama_jenis_tagihan: "DPP",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 2,
        nama_jenis_tagihan: "KKL",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 3,
        nama_jenis_tagihan: "KKN",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 4,
        nama_jenis_tagihan: "PKL",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 5,
        nama_jenis_tagihan: "PMB",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 6,
        nama_jenis_tagihan: "PPL",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 7,
        nama_jenis_tagihan: "Skripsi",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 8,
        nama_jenis_tagihan: "SPP",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 9,
        nama_jenis_tagihan: "SPP-KIPK",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 10,
        nama_jenis_tagihan: "Wisuda",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id_jenis_tagihan: 11,
        nama_jenis_tagihan: "Yudisium",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("jenis_tagihans", null, {});
  }
};
