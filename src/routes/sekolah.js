const express = require("express");

const router = express.Router();

// import controller dan middleware
const SekolahController = require("../controllers/sekolah");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-pmb", "camaba"]), SekolahController.getAllSekolah);
router.get("/:id/get", checkRole(["admin", "admin-pmb", "camaba"]), SekolahController.getSekolahById);
router.get("/data/smk/get", checkRole(["admin", "admin-pmb", "camaba"]), SekolahController.getAllSekolahSMK);
router.get("/data/sma/get", checkRole(["admin", "admin-pmb", "camaba"]), SekolahController.getAllSekolahSMA);

module.exports = router;
