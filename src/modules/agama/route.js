const express = require("express");

const router = express.Router();

// import controller dan middleware
const AgamaController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), AgamaController.getAllAgamas);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), AgamaController.getAgamaById);

module.exports = router;
