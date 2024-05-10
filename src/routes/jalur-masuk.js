const express = require("express");

const router = express.Router();

// import controller dan middleware
const JalurMasukController = require("../controllers/jalur-masuk");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), JalurMasukController.getAllJalurMasuk);
router.get("/:id/get", checkRole(["admin"]), JalurMasukController.getJalurMasukById);

module.exports = router;
