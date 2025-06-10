const express = require("express");

const router = express.Router();

// import controller dan middleware
const TahapTesPeriodePendaftaranController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), TahapTesPeriodePendaftaranController.getAllTahapTesPeriodePendaftaran);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), TahapTesPeriodePendaftaranController.getTahapTesPeriodePendaftaranById);
router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), TahapTesPeriodePendaftaranController.getTahapTesPeriodePendaftaranByPeriodePendaftaranId);
router.get("/:id_camaba/get-tahap-tes-periode-pendaftaran-camaba", checkRole(["admin", "admin-pmb"]), TahapTesPeriodePendaftaranController.getTahapTesPeriodePendaftaranByCamabaId);

module.exports = router;
