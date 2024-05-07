const express = require("express");

const router = express.Router();

// import controller
const PenghasilanController = require("../controllers/penghasilan");

// all routes
router.get("/", PenghasilanController.getAllPenghasilan);
router.get("/:id/get", PenghasilanController.getPenghasilanById);

module.exports = router;
