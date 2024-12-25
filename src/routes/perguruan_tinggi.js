const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerguruanTinggiController = require("../controllers/perguruan-tinggi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), PerguruanTinggiController.getAllPerguruanTinggi);
router.get("/:id/get", checkRole(["admin"]), PerguruanTinggiController.getPerguruanTinggiById);
router.put("/:id/update", checkRole(["admin"]), PerguruanTinggiController.updatePerguruanTinggiById);
router.get("/get-data-kop-surat", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan", "admin-pmb", "camaba"]), PerguruanTinggiController.getDataKopSurat);

module.exports = router;
