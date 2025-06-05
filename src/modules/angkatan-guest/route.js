const express = require("express");

const router = express.Router();

// import controller dan middleware
const AngkatanGuestController = require("./controller");

// all routes
router.get("/", AngkatanGuestController.getAllAngkatanByGuest);

module.exports = router;
