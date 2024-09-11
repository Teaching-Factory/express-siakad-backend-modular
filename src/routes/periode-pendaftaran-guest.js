const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodePendaftaranGuestController = require("../controllers/periode-pendaftaran");

// all routes
router.get("/periode-pendaftaran/dibuka/get", PeriodePendaftaranGuestController.getPeriodePendaftaranDibuka);

module.exports = router;
