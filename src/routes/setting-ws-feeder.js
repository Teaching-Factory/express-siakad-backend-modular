const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingWSFeederController = require("../controllers/setting-ws-feeder");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), SettingWSFeederController.getAllSettingWSFeeder);
router.get("/:id/get", checkRole(["admin"]), SettingWSFeederController.getSettingWSFeederById);
router.get("/get-setting-ws-feeder-aktif", checkRole(["admin", "admin-prodi", "admin-keuangan", "dosen", "mahasiswa"]), SettingWSFeederController.getSettingWSFeederAktif);
router.post("/create", checkRole(["admin"]), SettingWSFeederController.createSettingWSFeeder);
router.put("/update", checkRole(["admin"]), SettingWSFeederController.updateSettingWSFeeder);

module.exports = router;
