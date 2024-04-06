const express = require("express");

const router = express.Router();

// import controller
const KrsValidasiController = require("../controllers/krs-validasi");

// all routes
router.put("/:id/accept", KrsValidasiController.validasiKrsAccept);

module.exports = router;
