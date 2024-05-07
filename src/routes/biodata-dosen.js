const express = require("express");

const router = express.Router();

// import controller
const BiodataDosenController = require("../controllers/biodata-dosen");

// all routes
router.get("/", BiodataDosenController.getAllBiodataDosen);
router.get("/:id/get", BiodataDosenController.getBiodataDosenById);

module.exports = router;
