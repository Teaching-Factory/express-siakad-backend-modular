const express = require("express");

const router = express.Router();

// import controller
const JabatanController = require("../controllers/jabatan");

// all routes
router.get("/", JabatanController.getAllJabatans);
router.get("/:id/get", JabatanController.getJabatanById);
router.post("/create", JabatanController.createJabatan);
router.put("/:id/update", JabatanController.updateJabatanById);
router.delete("/:id/delete", JabatanController.deleteJabatanById);

module.exports = router;
