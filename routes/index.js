const express = require("express");
const router = express.Router();

// route api local (modular)
const userRoutes = require("../src/modules/user");
const authRoutes = require("../src/modules/auth");
const roleRoutes = require("../src/modules/role");
const rolePermissionRoutes = require("../src/modules/role-permission");
const agamaRoutes = require("../src/modules/agama");

// import middleware
const checkToken = require("../src/middlewares/check-token");

// endpoint api local (modular)
router.use("/user", checkToken, userRoutes);
router.use("/auth", authRoutes);
router.use("/role", checkToken, roleRoutes);
router.use("/role-permission", checkToken, rolePermissionRoutes);
router.use("/agama", checkToken, agamaRoutes);

module.exports = router;
