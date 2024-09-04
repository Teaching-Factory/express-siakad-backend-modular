"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("setting_ws_feeders", [
      {
        url_feeder: "-",
        username_feeder: "-",
        password_feeder: "-",
        status: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("setting_ws_feeders", null, {});
  }
};
