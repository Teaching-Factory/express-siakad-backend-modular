const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiPeriodePendaftaranController = require("../controllers/prodi-periode-pendaftaran");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), ProdiPeriodePendaftaranController.getAllProdiPeriodePendaftaran);
router.get("/:id/get", checkRole(["admin", "admin-pmb"]), ProdiPeriodePendaftaranController.getProdiPeriodePendaftaranById);
router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", checkRole(["admin", "admin-pmb"]), ProdiPeriodePendaftaranController.getProdiPeriodePendaftaranByPeriodePendaftaranId);

module.exports = router;
