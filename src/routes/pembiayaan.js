const express = require("express");

const router = express.Router();

// import controller
const PembiayaanController = require("../controllers/pembiayaan");

// all routes
router.get("/", PembiayaanController.getAllPembiayaan);
router.get("/:id/get", PembiayaanController.getPembiayaanById);

module.exports = router;
