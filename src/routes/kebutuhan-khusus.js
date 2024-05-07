const express = require("express");

const router = express.Router();

// import controller
const KebutuhanKhususController = require("../controllers/kebutuhan-khusus");

// all routes
router.get("/", KebutuhanKhususController.getAllKebutuhanKhusus);
router.get("/:id/get", KebutuhanKhususController.getKebutuhanKhususById);

module.exports = router;
