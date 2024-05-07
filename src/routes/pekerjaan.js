const express = require("express");

const router = express.Router();

// import controller
const PekerjaanController = require("../controllers/pekerjaan");

// all routes
router.get("/", PekerjaanController.getAllPekerjaan);
router.get("/:id/get", PekerjaanController.getPekerjaanById);

module.exports = router;
