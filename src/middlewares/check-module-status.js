const fs = require("fs");
const path = require("path");

const modulesPath = path.join(__dirname, "../modules/modules.json");
let modulesData = {};

try {
  modulesData = JSON.parse(fs.readFileSync(modulesPath, "utf-8"));
} catch (err) {
  console.error("Gagal membaca modules.json:", err);
}

const checkModuleStatus = (moduleName) => {
  return (req, res, next) => {
    // Reload data (optional: kalau modules.json bisa berubah saat runtime)
    try {
      modulesData = JSON.parse(fs.readFileSync(modulesPath, "utf-8"));
    } catch (err) {
      console.error("Gagal membaca modules.json:", err);
    }

    if (!modulesData[moduleName] || modulesData[moduleName].enabled === false) {
      return res.status(503).json({
        message: `Module '${moduleName}' is currently unavailable.`,
      });
    }

    next(); // Lanjut ke route berikutnya
  };
};

module.exports = checkModuleStatus;
