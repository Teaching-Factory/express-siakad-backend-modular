const express = require("express");

const router = express.Router();

// import controller
const DetailPeriodePerkuliahanController = require("../controllers/detail-periode-perkuliahan");

// all routes
router.get("/", DetailPeriodePerkuliahanController.getAllDetailPeriodePerkuliahan);
router.get("/:id/get", DetailPeriodePerkuliahanController.getDetailPeriodePerkuliahanById);

module.exports = router;
