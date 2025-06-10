const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodePendaftaranGuestController = require("./controller");

// all routes
router.get("/periode-pendaftaran/dibuka/get", PeriodePendaftaranGuestController.getPeriodePendaftaranDibuka);
router.get("/:id/get", PeriodePendaftaranGuestController.getPeriodePendaftaranGuestById);

module.exports = router;
