const fs = require("fs");
const path = require("path");
const { Command } = require("commander");
const program = new Command();

/*

SAMPLE COMMAND FOR MODULES
1. Add new module: npm run cli make:module alat-transportasi
2. Disable any module : npm run cli disable:module alat-transportasi
3. Enable any module : npm run cli enable:module alat-transportasi

*/

// command add new module
program
  .command("make:module <name>")
  .description("Buat module baru dengan struktur dasar")
  .action((name) => {
    const moduleName = name.toLowerCase();
    const basePath = path.join(__dirname, "../src/modules", moduleName);
    const modulesJsonPath = path.join(__dirname, "../src/modules/modules.json");

    if (fs.existsSync(basePath)) {
      console.log(`Modul "${moduleName}" sudah ada!`);
      return;
    }

    fs.mkdirSync(basePath, { recursive: true });

    // Template isi file

    // membuat file controller.js baru
    const controllerContent = `const { YourModels } = require("../../../models");

module.exports = {
  // your functions
};
    `;

    // membuat file route.ks baru
    const routeContent = `const express = require("express");

const router = express.Router();

// import controller dan middleware
const YourControllerName = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all your routes bellow here
// (right here)

module.exports = router;
    `;

    // membuat file index.js baru
    const indexContent = `const router = require("./route");
module.exports = router;
    `;

    // Tulis file
    fs.writeFileSync(path.join(basePath, "controller.js"), controllerContent);
    fs.writeFileSync(path.join(basePath, "route.js"), routeContent);
    fs.writeFileSync(path.join(basePath, "index.js"), indexContent);

    // Simpan ke modules.json
    let modulesData = {};
    if (fs.existsSync(modulesJsonPath)) {
      const raw = fs.readFileSync(modulesJsonPath);
      modulesData = JSON.parse(raw);
    }

    modulesData[moduleName] = {
      enabled: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(modulesJsonPath, JSON.stringify(modulesData, null, 2));

    console.log(`Modul "${moduleName}" berhasil dibuat!`);
  });

// command for disable any module
program
  .command("disable:module <name>")
  .description("Nonaktifkan module tertentu")
  .action((name) => {
    const moduleName = name.toLowerCase();
    const modulesJsonPath = path.join(__dirname, "../src/modules/modules.json");

    // Cek apakah modules.json ada
    if (!fs.existsSync(modulesJsonPath)) {
      console.log(`File modules.json tidak ditemukan!`);
      return;
    }

    const raw = fs.readFileSync(modulesJsonPath);
    const modulesData = JSON.parse(raw);

    // Cek apakah modul ada
    if (!modulesData[moduleName]) {
      console.log(`Modul "${moduleName}" tidak terdaftar di modules.json`);
      return;
    }

    // Cek apakah sudah disable
    if (modulesData[moduleName].enabled === false) {
      console.log(`Modul "${moduleName}" sudah dalam keadaan nonaktif.`);
      return;
    }

    modulesData[moduleName] = {
      ...modulesData[moduleName],
      enabled: false,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(modulesJsonPath, JSON.stringify(modulesData, null, 2));

    console.log(`Modul "${moduleName}" berhasil dinonaktifkan.`);
  });

// command for enable any module
program
  .command("enable:module <name>")
  .description("Aktifkan module tertentu")
  .action((name) => {
    const moduleName = name.toLowerCase();
    const modulesJsonPath = path.join(__dirname, "../src/modules/modules.json");

    if (!fs.existsSync(modulesJsonPath)) {
      console.log(`File modules.json tidak ditemukan!`);
      return;
    }

    const raw = fs.readFileSync(modulesJsonPath);
    const modulesData = JSON.parse(raw);

    if (!modulesData[moduleName]) {
      console.log(`Modul "${moduleName}" tidak terdaftar di modules.json`);
      return;
    }

    if (modulesData[moduleName].enabled === true) {
      console.log(`Modul "${moduleName}" sudah dalam keadaan aktif.`);
      return;
    }

    // Gunakan spread untuk mempertahankan properti lama
    modulesData[moduleName] = {
      ...modulesData[moduleName],
      enabled: true,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(modulesJsonPath, JSON.stringify(modulesData, null, 2));
    console.log(`Modul "${moduleName}" berhasil diaktifkan.`);
  });

program.parse(process.argv);
