const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerguruanTinggiController = require("../controllers/perguruan-tinggi");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), PerguruanTinggiController.getAllPerguruanTinggi);
router.get("/:id/get", checkRole(["admin"]), PerguruanTinggiController.getPerguruanTinggiById);

module.exports = router;
