const express = require("express");

const router = express.Router();

// import controller dan middleware
const WilayahController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getAllWilayahs);
router.get("/simply", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getAllWilayahsSimply);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getWilayahById);
router.get("/get-wilayah-grouped", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getAllWilayahGrouped);

module.exports = router;
