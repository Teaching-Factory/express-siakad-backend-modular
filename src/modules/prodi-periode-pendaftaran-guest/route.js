const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiPeriodePendaftaranController = require("./controller");

// all routes
router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", ProdiPeriodePendaftaranController.getProdiPeriodePendaftaranByPeriodePendaftaranIdGuest);

module.exports = router;
