const express = require("express");

const router = express.Router();

// import controller dan middleware
const JenisSMSController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JenisSMSController.getAllJenisSMS);
router.get("/:id/get", checkRole(["admin"]), JenisSMSController.getJenisSMSById);

module.exports = router;
