const express = require("express");

const router = express.Router();

// import controller
const JenisSubstansiController = require("../controllers/jenis-substansi");

// all routes
router.get("/", JenisSubstansiController.getAllJenisSubstansi);
router.get("/:id/get", JenisSubstansiController.getJenisSubstansiById);

module.exports = router;
