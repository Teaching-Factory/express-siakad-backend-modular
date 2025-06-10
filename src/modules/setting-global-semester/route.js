const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingGlobalSemesterController = require("./controller");
const checkRole = require("../../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan", "camaba", "admin-pmb"]), SettingGlobalSemesterController.getAllSettingGlobalSemester);
router.get("/:id/get", checkRole(["admin"]), SettingGlobalSemesterController.getSettingGlobalSemesterById);
router.get("/get-setting-global-semester-active", checkRole(["admin", "admin-prodi", "dosen", "mahasiswa", "admin-keuangan", "camaba", "admin-pmb"]), SettingGlobalSemesterController.getSettingGlobalSemesterAktif);
router.post("/create", checkRole(["admin"]), SettingGlobalSemesterController.createSettingGlobalSemester);
router.put("/update", checkRole(["admin"]), SettingGlobalSemesterController.updateSettingGlobalSemester);

module.exports = router;
