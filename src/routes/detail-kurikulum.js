const express = require("express");

const router = express.Router();

// import controller
const DetailKurikulumController = require("../controllers/detail-kurikulum");

// all routes
router.get("/", DetailKurikulumController.getAllDetailKurikulum);
router.get("/:id/get", DetailKurikulumController.getDetailKurikulumById);

module.exports = router;
