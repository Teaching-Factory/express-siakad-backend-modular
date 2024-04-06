const express = require("express");

const router = express.Router();

// import controller
const KurikulumController = require("../controllers/kurikulum");

// all routes
router.get("/", KurikulumController.getAllKurikulums);
router.get("/:id/get", KurikulumController.getKurikulumById);
router.post("/create", KurikulumController.createKurikulum);
router.put("/:id/update", KurikulumController.updateKurikulumById);
router.delete("/:id/delete", KurikulumController.deleteKurikulumById);

module.exports = router;
