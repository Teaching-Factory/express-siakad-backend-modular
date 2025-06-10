const express = require("express");

const router = express.Router();

// import controller dan middleware
const BerkasPeriodePendaftaranController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), BerkasPeriodePendaftaranController.getAllBerkasPeriodePendaftaran);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), BerkasPeriodePendaftaranController.getBerkasPeriodePendaftaranById);
router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), BerkasPeriodePendaftaranController.getBerkasPeriodePendaftaranByPeriodePendaftaranId);

module.exports = router;
