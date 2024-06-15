const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingGlobalController = require("../controllers/setting-global");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/get", checkRole(["admin"]), SettingGlobalController.getAllSettingGlobals);
router.put("/update", checkRole(["admin"]), SettingGlobalController.updateSettingGlobal);

module.exports = router;
