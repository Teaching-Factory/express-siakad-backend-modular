const express = require("express");

const router = express.Router();

// import controller
const SettingWSController = require("../controllers/setting-ws");

// all routes
router.post("/create-web-service", SettingWSController.createWebService);
router.get("/get-web-service", SettingWSController.getWebService);
router.put("/update-web-service", SettingWSController.updateWebService);

module.exports = router;
