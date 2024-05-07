const express = require("express");

const router = express.Router();

// import controller
const JalurMasukController = require("../controllers/jalur-masuk");

// all routes
router.get("/", JalurMasukController.getAllJalurMasuk);
router.get("/:id/get", JalurMasukController.getJalurMasukById);

module.exports = router;
