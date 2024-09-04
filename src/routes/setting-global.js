const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingGlobalController = require("../controllers/setting-global");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), SettingGlobalController.getAllSettingGlobals);
router.get("/:id/get", checkRole(["admin"]), SettingGlobalController.getSettingGlobalById);
router.post("/create-setting-global", checkRole(["admin"]), SettingGlobalController.createSettingGlobal);
router.put("/update-all-setting", checkRole(["admin"]), SettingGlobalController.updateSettingGlobal);
router.delete("/:id/delete", checkRole(["admin"]), SettingGlobalController.deleteSettingGlobalById);

module.exports = router;
