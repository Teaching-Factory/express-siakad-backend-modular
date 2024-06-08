const express = require("express");

const router = express.Router();

// import controller dan middleware
const SkalaNilaiProdiController = require("../controllers/skala-nilai-prodi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), SkalaNilaiProdiController.getAllSkalaNilaiProdi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SkalaNilaiProdiController.getSkalaNilaiProdiById);

module.exports = router;
