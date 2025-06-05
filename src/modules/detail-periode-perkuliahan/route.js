const express = require("express");

const router = express.Router();

// import controller dan middleware
const DetailPeriodePerkuliahanController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi"]), DetailPeriodePerkuliahanController.getAllDetailPeriodePerkuliahan);
router.get("/:id/get", checkRole(["admin", "admin-prodi"]), DetailPeriodePerkuliahanController.getDetailPeriodePerkuliahanById);

module.exports = router;

    