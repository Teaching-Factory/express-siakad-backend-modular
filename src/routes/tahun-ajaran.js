const express = require("express");

const router = express.Router();

// import controller
const TahunAjaranController = require("../controllers/tahun-ajaran");

// all routes
router.get("/", TahunAjaranController.getAllTahunAjaran);
router.get("/:id/get", TahunAjaranController.getTahunAjaranById);

module.exports = router;
