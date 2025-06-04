const express = require("express");

const router = express.Router();

// import controller dan middleware
const ProdiGuestController = require("./controller");

// all routes
router.get("/", ProdiGuestController.getAllProdiByGuest);

module.exports = router;
