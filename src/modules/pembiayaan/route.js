const express = require("express");

const router = express.Router();

// import controller dan middleware
const PembiayaanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), PembiayaanController.getAllPembiayaan);
router.get("/:id/get", checkRole(["admin"]), PembiayaanController.getPembiayaanById);

module.exports = router;
