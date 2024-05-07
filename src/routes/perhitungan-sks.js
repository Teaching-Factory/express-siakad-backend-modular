const express = require("express");

const router = express.Router();

// import controller
const PerhitunganSKSController = require("../controllers/perhitungan-sks");

// all routes
router.get("/", PerhitunganSKSController.getAllPerhitunganSKS);
router.get("/:id/get", PerhitunganSKSController.getPerhitunganSKSById);

module.exports = router;
