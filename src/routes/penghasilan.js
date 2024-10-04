const express = require("express");

const router = express.Router();

// import controller dan middleware
const PenghasilanController = require("../controllers/penghasilan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "mahasiswa", "camaba", "admin-pmb"]), PenghasilanController.getAllPenghasilan);
router.get("/:id/get", checkRole(["admin", "admin-prodi", "mahasiswa", "camaba", "admin-pmb"]), PenghasilanController.getPenghasilanById);

module.exports = router;
