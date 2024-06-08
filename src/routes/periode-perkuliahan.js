const express = require("express");

const router = express.Router();

// import controller dan middleware
const PeriodePerkuliahanController = require("../controllers/periode-perkuliahan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), PeriodePerkuliahanController.getAllPeriodePerkuliahan);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), PeriodePerkuliahanController.getPeriodePerkuliahanById);

module.exports = router;
