const express = require("express");

const router = express.Router();

// import controller
const SettingGlobalController = require("../controllers/setting-global");

// all routes
router.get("/get", SettingGlobalController.getAllSettingGlobals);
router.put("/update", SettingGlobalController.updateSettingGlobal);

module.exports = router;
