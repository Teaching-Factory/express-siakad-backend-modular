const express = require("express");

const router = express.Router();

// import controller
const SettingWSController = require("../controllers/setting-ws");

// all routes
router.post("/create", SettingWSController.createWebService);
router.get("/get", SettingWSController.getWebService);
router.put("/update", SettingWSController.updateWebService);

module.exports = router;
