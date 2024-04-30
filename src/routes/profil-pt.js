const express = require("express");

const router = express.Router();

// import controller
const ProfilPTController = require("../controllers/profil-pt");

// all routes
router.get("/", ProfilPTController.getAllProfilPT);
router.get("/:id/get", ProfilPTController.getProfilPTById);

module.exports = router;
