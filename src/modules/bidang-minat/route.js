const express = require("express");

const router = express.Router();

// import controller dan middleware
const BidangMinatController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), BidangMinatController.getAllBidangMinat);
router.get("/:id/get", checkRole(["admin"]), BidangMinatController.getBidangMinatById);

module.exports = router;
