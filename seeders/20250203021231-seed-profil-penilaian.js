"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("profil_penilaians", [
      {
        id: 1,
        nilai_min: 0,
        nilai_max: 45,
        nilai_indeks: 0,
        nilai_huruf: "E",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        nilai_min: 46,
        nilai_max: 54,
        nilai_indeks: 1,
        nilai_huruf: "D",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        nilai_min: 55,
        nilai_max: 70,
        nilai_indeks: 2,
        nilai_huruf: "C",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 4,
        nilai_min: 71,
        nilai_max: 85,
        nilai_indeks: 3,
        nilai_huruf: "B",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 5,
        nilai_min: 86,
        nilai_max: 100,
        nilai_indeks: 4,
        nilai_huruf: "A",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("profil_penilaians", null, {});
  },
};
