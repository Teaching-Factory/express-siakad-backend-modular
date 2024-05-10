const express = require("express");

const router = express.Router();

// import controller dan middleware
const StatusKeaktifanPegawaiController = require("../controllers/status-keaktifan-pegawai");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), StatusKeaktifanPegawaiController.getAllStatusKeaktifanPegawai);
router.get("/:id/get", checkRole(["admin"]), StatusKeaktifanPegawaiController.getStatusKeaktifanPegawaiById);

module.exports = router;
