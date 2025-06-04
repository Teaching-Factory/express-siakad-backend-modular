const express = require("express");

const router = express.Router();

// import controller dan middleware
const AlatTransportasiController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), AlatTransportasiController.getAllAlatTransportasi);
router.get("/:id/get", checkRole(["admin"]), AlatTransportasiController.getAlatTransportasiById);

module.exports = router;
