const express = require("express");

const router = express.Router();

// import controller dan middleware
const JalurMasukController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb"]), JalurMasukController.getAllJalurMasuk);
router.get("/:id/get", checkRole(["admin"]), JalurMasukController.getJalurMasukById);

module.exports = router;
