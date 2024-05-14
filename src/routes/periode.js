const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodeController = require("../controllers/periode");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PeriodeController.getAllPeriode);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PeriodeController.getPeriodeById);

module.exports = router;
