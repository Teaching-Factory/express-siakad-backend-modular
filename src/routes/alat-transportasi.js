const express = require("express");

const router = express.Router();

// import controller
const AlatTransportasiController = require("../controllers/alat-transportasi");

// all routes
router.get("/", AlatTransportasiController.getAllAlatTransportasi);
router.get("/:id/get", AlatTransportasiController.getAlatTransportasiById);

module.exports = router;
