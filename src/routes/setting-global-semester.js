const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingGlobalSemesterController = require("../controllers/setting-global-semester");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), SettingGlobalSemesterController.getAllSettingGlobalSemester);
router.get("/:id/get", checkRole(["admin"]), SettingGlobalSemesterController.getSettingGlobalSemesterById);
router.get("/get-setting-global-semester-active", checkRole(["admin"]), SettingGlobalSemesterController.getSettingGlobalSemesterAktif);
router.post("/create", checkRole(["admin"]), SettingGlobalSemesterController.createSettingGlobalSemester);
router.put("/update", checkRole(["admin"]), SettingGlobalSemesterController.updateSettingGlobalSemester);

module.exports = router;
