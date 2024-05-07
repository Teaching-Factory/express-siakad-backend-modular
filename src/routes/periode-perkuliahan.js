const express = require("express");

const router = express.Router();

// import controller
const PeriodePerkuliahanController = require("../controllers/periode-perkuliahan");

// all routes
router.get("/", PeriodePerkuliahanController.getAllPeriodePerkuliahan);
router.get("/:id/get", PeriodePerkuliahanController.getPeriodePerkuliahanById);

module.exports = router;
