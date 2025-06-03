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

// endpoint api local (modular)
router.use("/user", checkToken, userRoutes);
router.use("/auth", authRoutes);
router.use("/role", checkToken, roleRoutes);
router.use("/role-permission", checkToken, rolePermissionRoutes);
router.use("/agama", checkToken, agamaRoutes);
router.use("/negara", checkToken, negaraRoutes);
router.use("/wilayah", checkToken, wilayahRoutes);
router.use("/perguruan-tinggi", checkToken, perguruanTinggiRoutes);
router.use("/profil-pt", checkToken, profilPTRoutes);
router.use("/jalur-masuk", checkToken, jalurMasukRoutes);
router.use("/jenis-pendaftaran", checkToken, jenisPendaftaranRoutes);
router.use("/jenis-tinggal", checkToken, jenisTinggalRoutes);

module.exports = router;
