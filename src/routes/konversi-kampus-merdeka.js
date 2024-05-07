const express = require("express");

const router = express.Router();

// import controller
const KonversiKampusMerdekaController = require("../controllers/konversi-kampus-merdeka");

// all routes
router.get("/", KonversiKampusMerdekaController.getAllKonversiKampusMerdeka);
router.get("/:id/get", KonversiKampusMerdekaController.getKonversiKampusMerdekaById);

module.exports = router;
