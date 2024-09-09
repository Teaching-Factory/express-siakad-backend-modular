"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("sumbers", [
      {
        id: 1,
        nama_sumber: "Brosur",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        nama_sumber: "Google",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        nama_sumber: "Teman/Kerabat",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        nama_sumber: "Sosial Media",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        nama_sumber: "Facebook",
        status: true,

        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        nama_sumber: "Instagram",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        nama_sumber: "Alumni",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        nama_sumber: "Radio",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 9,
        nama_sumber: "Lainnya",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("sumbers", null, {});
  }
};
