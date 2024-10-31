const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiGuestController = require("../controllers/prodi-guest");

// all routes
router.get("/", ProdiGuestController.getAllProdiByGuest);

module.exports = router;
