const express = require("express");

const router = express.Router();

// import controller
const SkalaNilaiProdiController = require("../controllers/skala-nilai-prodi");

// all routes
router.get("/", SkalaNilaiProdiController.getAllSkalaNilaiProdi);
router.get("/:id/get", SkalaNilaiProdiController.getSkalaNilaiProdiById);

module.exports = router;
