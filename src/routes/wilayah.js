const express = require("express");

const router = express.Router();

// import controller dan middleware
const WilayahController = require("../controllers/wilayah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getAllWilayahs);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), WilayahController.getWilayahById);

module.exports = router;
