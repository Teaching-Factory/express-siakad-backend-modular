const express = require("express");

const router = express.Router();

// import controller
const StatusKeaktifanPegawaiController = require("../controllers/status-keaktifan-pegawai");

// all routes
router.get("/", StatusKeaktifanPegawaiController.getAllStatusKeaktifanPegawai);
router.get("/:id/get", StatusKeaktifanPegawaiController.getStatusKeaktifanPegawaiById);

module.exports = router;
