"use strict";

// belum fiks
const fs = require("fs");
const path = require("path");
const { Permission } = require("../models");

module.exports = {
  async up(queryInterface, Sequelize) {
    const endpointDir = path.join(__dirname, "controllers"); // Direktori tempat file-file endpoint berada

    // Fungsi untuk membaca dan mengekstraksi endpoint dari file-file endpoint
    const readEndpoints = (dir) => {
      const files = fs.readdirSync(dir);
      const endpoints = [];
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile() && file.endsWith(".js")) {
          const content = fs.readFileSync(filePath, "utf8");
          const matches = content.match(/(router\..*(get|post|put|delete)\s*\(\s*["'`](\/.*)["'`])/g);
          if (matches) {
            matches.forEach((match) => {
              const endpoint = match.match(/(["'`])(\/.*)\1/);
              if (endpoint) {
                endpoints.push(endpoint[2]);
              }
            });
          }
        }
      });
      return endpoints;
    };

    // Fungsi untuk menyimpan endpoint ke dalam tabel Permission
    const seedEndpoints = async () => {
      const endpoints = readEndpoints(endpointDir);
      try {
        const permissions = await Permission.bulkCreate(endpoints.map((endpoint) => ({ name: endpoint })));
        console.log(
          "Endpoints successfully seeded:",
          permissions.map((permission) => permission.name)
        );
      } catch (error) {
        console.error("Error seeding endpoints:", error);
      }
    };

    // Panggil fungsi untuk menyimpan endpoint
    await seedEndpoints();
  },

  async down(queryInterface, Sequelize) {
    // Hapus semua data permission
    await Permission.destroy({ where: {} });
    console.log("Permissions data deleted.");
  },
};
