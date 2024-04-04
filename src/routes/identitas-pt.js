const express = require("express");

const router = express.Router();

// import controller
const IdentitasPTController = require("../controllers/identitas-pt");

// all routes
router.get("/get-pt", IdentitasPTController.getPT);
router.put("/update-pt", IdentitasPTController.updatePT);

module.exports = router;
