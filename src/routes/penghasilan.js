const express = require("express");

const router = express.Router();

// import controller dan middleware
const PenghasilanController = require("../controllers/penghasilan");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "mahasiswa"]), PenghasilanController.getAllPenghasilan);
router.get("/:id/get", checkRole(["admin"]), PenghasilanController.getPenghasilanById);

module.exports = router;
