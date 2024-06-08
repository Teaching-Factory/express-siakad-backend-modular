const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerhitunganSKSController = require("../controllers/perhitungan-sks");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PerhitunganSKSController.getAllPerhitunganSKS);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PerhitunganSKSController.getPerhitunganSKSById);

module.exports = router;
