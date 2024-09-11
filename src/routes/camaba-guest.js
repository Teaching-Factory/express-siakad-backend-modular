const express = require("express");

const router = express.Router();

// import controller dan middleware
const CamabaGuestController = require("../controllers/camaba");

// all routes
router.get("/:id/get", CamabaGuestController.getCamabaById);
router.post("/:id_periode_pendaftaran/create", CamabaGuestController.createCamaba);

module.exports = router;
