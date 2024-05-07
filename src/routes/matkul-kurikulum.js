const express = require("express");

const router = express.Router();

// import controller
const MatkulKurikulumController = require("../controllers/matkul-kurikulum");

// all routes
router.get("/", MatkulKurikulumController.getAllMatkulKurikulum);
router.get("/:id/get", MatkulKurikulumController.getMatkulKurikulumById);

module.exports = router;
