"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("contact_person_pmbs", [
      {
        id: 1,
        nama_cp_pmb: "-",
        no_wa_cp_pmb: "-",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("contact_person_pmbs", null, {});
  }
};
