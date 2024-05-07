const express = require("express");

const router = express.Router();

// import controller
const JenisTinggalController = require("../controllers/jenis-tinggal");

// all routes
router.get("/", JenisTinggalController.getAllJenisTinggal);
router.get("/:id/get", JenisTinggalController.getJenisTinggalById);

module.exports = router;
