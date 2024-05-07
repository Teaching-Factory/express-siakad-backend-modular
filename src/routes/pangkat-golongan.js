const express = require("express");

const router = express.Router();

// import controller
const PangkatGolonganController = require("../controllers/pangkat-golongan");

// all routes
router.get("/", PangkatGolonganController.getAllPangkatGolongan);
router.get("/:id/get", PangkatGolonganController.getPangkatGolonganById);

module.exports = router;
