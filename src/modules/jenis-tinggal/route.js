const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisTinggalController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), JenisTinggalController.getAllJenisTinggal);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "admin-keuangan", "admin-pmb", "dosen", "mahasiswa", "camaba"]), JenisTinggalController.getJenisTinggalById);

module.exports = router;
