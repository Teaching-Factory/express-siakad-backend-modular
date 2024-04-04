const express = require("express");

const router = express.Router();

// import controller
const SettingGlobalController = require("../controllers/setting-global");

// all routes
router.get("/get-access", SettingGlobalController.getAllSettingGlobals);
router.put("/update-access", SettingGlobalController.updateSettingGlobal);

module.exports = router;
