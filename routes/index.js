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

module.exports = router;
