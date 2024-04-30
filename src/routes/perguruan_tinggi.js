const express = require("express");

const router = express.Router();

// import controller
const PerguruanTinggiController = require("../controllers/perguruan-tinggi");

// all routes
router.get("/", PerguruanTinggiController.getAllPerguruanTinggi);
router.get("/:id/get", PerguruanTinggiController.getPerguruanTinggiById);

module.exports = router;
