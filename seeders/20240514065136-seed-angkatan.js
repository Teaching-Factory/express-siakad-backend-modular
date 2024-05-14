"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const angkatans = [];
    const currentYear = new Date().getFullYear();
    let id = 1;

    for (let year = 1980; year <= currentYear; year++) {
      angkatans.push({
        id: id++,
        tahun: year.toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return queryInterface.bulkInsert("angkatans", angkatans, {});
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("angkatans", null, {});
  },
};
