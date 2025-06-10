const express = require("express");

const router = express.Router();

// import controller dan middleware
const UserGuidePMBGuestController = require("./controller");

// all routes
router.get("/get-aktif", UserGuidePMBGuestController.getUserGuidePMBGuestAktif);

module.exports = router;
