const express = require("express");
const router = express.Router();

// route api local (modular)
const userRoutes = require("../src/modules/user");
const authRoutes = require("../src/modules/auth");
const roleRoutes = require("../src/modules/role");
const rolePermissionRoutes = require("../src/modules/role-permission");
const agamaRoutes = require("../src/modules/agama");
const negaraRoutes = require("../src/modules/negara");
const wilayahRoutes = require("../src/modules/wilayah");
const perguruanTinggiRoutes = require("../src/modules/perguruan-tinggi");
const profilPTRoutes = require("../src/modules/profil-pt");
const jalurMasukRoutes = require("../src/modules/jalur-masuk");
const jenisPendaftaranRoutes = require("../src/modules/jenis-pendaftaran");
const jenisTinggalRoutes = require("../src/modules/jenis-tinggal");

// import middleware
const checkToken = require("../src/middlewares/check-token");
const checkModuleStatus = require("../src/middlewares/check-module-status");

// endpoint api local (modular)
router.use("/user", checkToken, checkModuleStatus("user"), userRoutes);
router.use("/auth", checkModuleStatus("auth"), authRoutes);
router.use("/role", checkToken, checkModuleStatus("role"), roleRoutes);
router.use("/role-permission", checkToken, checkModuleStatus("role-permission"), rolePermissionRoutes);
router.use("/agama", checkToken, checkModuleStatus("agama"), agamaRoutes);
router.use("/negara", checkToken, checkModuleStatus("negara"), negaraRoutes);
router.use("/wilayah", checkToken, checkModuleStatus("wilayah"), wilayahRoutes);
router.use("/perguruan-tinggi", checkToken, checkModuleStatus("perguruan-tinggi"), perguruanTinggiRoutes);
router.use("/profil-pt", checkToken, checkModuleStatus("profil-pt"), profilPTRoutes);
router.use("/jalur-masuk", checkToken, checkModuleStatus("jalur-masuk"), jalurMasukRoutes);
router.use("/jenis-pendaftaran", checkToken, checkModuleStatus("jenis-pendaftaran"), jenisPendaftaranRoutes);
router.use("/jenis-tinggal", checkToken, checkModuleStatus("jenis-tinggal"), jenisTinggalRoutes);

module.exports = router;
