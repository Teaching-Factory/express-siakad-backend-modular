const express = require("express");

const router = express.Router();

// import controller dan middleware
const PangkatGolonganController = require("../controllers/pangkat-golongan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), PangkatGolonganController.getAllPangkatGolongan);
router.get("/:id/get", checkRole(["admin"]), PangkatGolonganController.getPangkatGolonganById);

module.exports = router;
