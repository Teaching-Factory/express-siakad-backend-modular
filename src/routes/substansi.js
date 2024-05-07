const express = require("express");

const router = express.Router();

// import controller
const SubstansiController = require("../controllers/substansi");

// all routes
router.get("/", SubstansiController.getAllSubstansi);
router.get("/:id/get", SubstansiController.getSubstansiById);

module.exports = router;
