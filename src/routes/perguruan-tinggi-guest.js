const express = require("express");

const router = express.Router();

// import controller dan middleware
const PerguruanTinggiGuestController = require("../controllers/perguruan-tinggi-guest");

// all routes
router.get("/get-pt-active", PerguruanTinggiGuestController.getProfilPTActive);

module.exports = router;
