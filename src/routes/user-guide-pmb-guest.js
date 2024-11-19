const express = require("express");

const router = express.Router();

// import controller dan middleware
const UserGuidePMBGuestController = require("../controllers/user-guide-pmb");

// all routes
router.get("/get-aktif", UserGuidePMBGuestController.getUserGuidePMBGuestAktif);

module.exports = router;
