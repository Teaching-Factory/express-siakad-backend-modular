const express = require("express");

const router = express.Router();

// import controller
const JenisSubstansiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JenisSubstansiController.getAllJenisSubstansi);
router.get("/:id/get", checkRole(["admin"]), JenisSubstansiController.getJenisSubstansiById);

module.exports = router;
