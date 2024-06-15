const express = require("express");

const router = express.Router();

// import controller dan middleware
const SubstansiController = require("../controllers/substansi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), SubstansiController.getAllSubstansi);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), SubstansiController.getSubstansiById);

module.exports = router;
