const express = require("express");

const router = express.Router();

// import controller
const BidangMinatController = require("../controllers/bidang-minat");

// all routes
router.get("/", BidangMinatController.getAllBidangMinat);
router.get("/:id/get", BidangMinatController.getBidangMinatById);

module.exports = router;
