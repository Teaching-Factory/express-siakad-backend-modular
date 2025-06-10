const express = require("express");

const router = express.Router();

// import controller dan middleware
const SumberPeriodePendaftaranController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), SumberPeriodePendaftaranController.getAllSumberPeriodePendaftaran);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), SumberPeriodePendaftaranController.getSumberPeriodePendaftaranById);
router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), SumberPeriodePendaftaranController.getSumberPeriodePendaftaranByPeriodePendaftaranId);

module.exports = router;
