const express = require("express");

const router = express.Router();

// import controller dan middleware
const PekerjaanController = require("../controllers/pekerjaan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), PekerjaanController.getAllPekerjaan);
router.get("/:id/get", checkRole(["admin"]), PekerjaanController.getPekerjaanById);

module.exports = router;
