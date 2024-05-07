const express = require("express");

const router = express.Router();

// import controller
const JenisSMSController = require("../controllers/jenis-sms");

// all routes
router.get("/", JenisSMSController.getAllJenisSMS);
router.get("/:id/get", JenisSMSController.getJenisSMSById);

module.exports = router;
