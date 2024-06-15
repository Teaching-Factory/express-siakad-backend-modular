const express = require("express");

const router = express.Router();

// import controller dan middleware
const SettingWSController = require("../controllers/setting-ws");
const checkRole = require("../middlewares/check-role");

// all routes
router.post("/create", checkRole(["admin"]), SettingWSController.createWebService);
router.get("/get", checkRole(["admin"]), SettingWSController.getWebService);
router.put("/update", checkRole(["admin"]), SettingWSController.updateWebService);

module.exports = router;
