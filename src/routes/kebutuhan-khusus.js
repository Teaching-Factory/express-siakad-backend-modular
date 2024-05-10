const express = require("express");

const router = express.Router();

// import controller dan middleware
const KebutuhanKhususController = require("../controllers/kebutuhan-khusus");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), KebutuhanKhususController.getAllKebutuhanKhusus);
router.get("/:id/get", checkRole(["admin"]), KebutuhanKhususController.getKebutuhanKhususById);

module.exports = router;
