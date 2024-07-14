const express = require("express");

const router = express.Router();

// import controller
const KurikulumController = require("../controllers/kurikulum");
const checkRole = require("../middlewares/check-role");

// all routes
router.get("/", checkRole(["admin"]), KurikulumController.getAllKurikulum);
router.get("/:id/get", checkRole(["admin"]), KurikulumController.getKurikulumById);

module.exports = router;
