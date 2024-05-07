const express = require("express");

const router = express.Router();

// import controller
const LembagaPengangkatanController = require("../controllers/lembaga-pengangkatan");

// all routes
router.get("/", LembagaPengangkatanController.getAllLembagaPengangkatan);
router.get("/:id/get", LembagaPengangkatanController.getLembagaPengangkatanById);

module.exports = router;
