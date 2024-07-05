"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("pembiayaans", [
      {
        id_pembiayaan: 4,
        nama_pembiayaan: "Bidikmisi",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("pembiayaans", null, {});
  },
};
