const express = require("express");

const router = express.Router();

// import middleware
const checkRole = require("../../middlewares/check-role");

// import controllers
const SekolahController = require("../api-external/data-api-external/sekolah");

// all routes
router.get("/sekolah/smk/get", checkRole(["admin"]), SekolahController.getSekolahSMK);
router.get("/sekolah/sma/get", checkRole(["admin"]), SekolahController.getSekolahSMA);

module.exports = router;
