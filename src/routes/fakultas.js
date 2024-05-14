const express = require("express");

const router = express.Router();

// import controller dan middleware
const FakultasController = require("../controllers/fakultas");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), FakultasController.getAllFakultas);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), FakultasController.getFakultasById);

module.exports = router;
