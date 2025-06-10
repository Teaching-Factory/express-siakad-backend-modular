const express = require("express");

const router = express.Router();

// import controller dan middleware
const SumberPeriodePendaftaranController = require("./controller");

router.get("/periode-pendaftaran/:id_periode_pendaftaran/get", SumberPeriodePendaftaranController.getSumberPeriodePendaftaranByPeriodePendaftaranId);

module.exports = router;
