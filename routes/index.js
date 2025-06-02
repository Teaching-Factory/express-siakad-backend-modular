const express = require("express");
const router = express.Router();

// route api local (modular)
const userRoutes = require("../src/modules/user");
const authRoutes = require("../src/modules/auth");

// import middleware
const checkToken = require("../src/middlewares/check-token");

// endpoint api local (modular)
router.use("/user", checkToken, userRoutes);
router.use("/auth", authRoutes);

module.exports = router;
