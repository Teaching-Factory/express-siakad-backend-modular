const express = require("express");

const router = express.Router();

// import controller dan middleware
const AngkatanGuestController = require("../controllers/angkatan-guest");

// all routes
router.get("/", AngkatanGuestController.getAllAngkatanByGuest);

module.exports = router;
